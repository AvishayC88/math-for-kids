import { create } from 'zustand';
import { MontessoriBlock, GameState, PlaceValue, GameMode, DifficultyLevel, MathDifficultyLevel } from '../domain/types';
import { LocalStorageRepository } from '../data/LocalStorageRepository';

const repo = new LocalStorageRepository();
const USER_ID = 'daughter_user_1';

function generateBlocksForNumber(num: number, groupId?: 1 | 2): MontessoriBlock[] {
  const blocks: MontessoriBlock[] = [];
  let remaining = num;
  const thousands = Math.floor(remaining / 1000); remaining %= 1000;
  for(let i=0; i<thousands; i++) blocks.push({ id: Math.random().toString(), type: 'thousand', value: 1000, groupId });
  const hundreds = Math.floor(remaining / 100); remaining %= 100;
  for(let i=0; i<hundreds; i++) blocks.push({ id: Math.random().toString(), type: 'hundred', value: 100, groupId });
  const tens = Math.floor(remaining / 10); remaining %= 10;
  for(let i=0; i<tens; i++) blocks.push({ id: Math.random().toString(), type: 'ten', value: 10, groupId });
  const units = remaining;
  for(let i=0; i<units; i++) blocks.push({ id: Math.random().toString(), type: 'unit', value: 1, groupId });
  return blocks;
}

function generateBlocksForSubtraction(minuend: number, subtrahend: number): MontessoriBlock[] {
  let reqUnits = subtrahend % 10;
  let reqTens = Math.floor(subtrahend / 10) % 10;
  let availUnits = minuend % 10;
  let availTens = Math.floor(minuend / 10) % 10;
  let availHundreds = Math.floor(minuend / 100) % 10;

  if (availUnits < reqUnits) {
    if (availTens > 0) { availTens--; availUnits += 10; }
    else if (availHundreds > 0) { availHundreds--; availTens += 9; availUnits += 10; }
  }
  if (availTens < Math.floor(subtrahend / 10) % 10) {
    if (availHundreds > 0) { availHundreds--; availTens += 10; }
  }

  const blocks: MontessoriBlock[] = [];
  for(let i=0; i<availHundreds; i++) blocks.push({ id: Math.random().toString(), type: 'hundred', value: 100 });
  for(let i=0; i<availTens; i++) blocks.push({ id: Math.random().toString(), type: 'ten', value: 10 });
  for(let i=0; i<availUnits; i++) blocks.push({ id: Math.random().toString(), type: 'unit', value: 1 });
  return blocks;
}

const MATH_LIMITS: Record<MathDifficultyLevel, number> = { upTo10: 10, upTo20: 20, upTo100: 100, upTo1000: 1000 };
const MATH_REWARDS: Record<MathDifficultyLevel, number> = { upTo10: 10, upTo20: 15, upTo100: 20, upTo1000: 30 };

interface GameStore extends GameState {
  initGame: () => Promise<void>;
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (level: DifficultyLevel) => void;
  setMathDifficulty: (level: MathDifficultyLevel) => void;
  addBlock: (type: PlaceValue) => void;
  removeBlock: (id: string) => void;
  toggleBlockGhostState: (id: string) => void;
  checkAnswer: () => void;
  checkRecognizeAnswer: (inputNumber: number) => void;
  checkMathAnswer: (inputNumber: number) => void;
  useLifeline: () => void;
  resetBoard: () => void;
  buySticker: (stickerId: string, cost: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameMode: 'build', difficulty: 'tens', mathDifficulty: 'upTo10',
  currentTargetNumber: 0, currentMathProblem: null, isLifelineUsed: false,
  placedBlocks: [], coinsCollected: 0, unlockedStickers: [],
  consecutiveSuccesses: 0, interactionState: 'playing', feedbackMessage: null,

  initGame: async () => {
    const savedProgress = await repo.getUserProgress(USER_ID);
    if (savedProgress) set({ ...savedProgress, unlockedStickers: savedProgress.unlockedStickers || [], interactionState: 'playing', feedbackMessage: null });
    else get().resetBoard();
  },

  setGameMode: (mode: GameMode) => { set({ gameMode: mode }); get().resetBoard(); },
  setDifficulty: (level: DifficultyLevel) => { set({ difficulty: level }); get().resetBoard(); },
  setMathDifficulty: (level: MathDifficultyLevel) => { set({ mathDifficulty: level }); get().resetBoard(); },

  addBlock: (type: PlaceValue) => {
    const val = type === 'thousand' ? 1000 : type === 'hundred' ? 100 : type === 'ten' ? 10 : 1;
    set((state) => ({ placedBlocks: [...state.placedBlocks, { id: Math.random().toString(), type, value: val }], interactionState: 'playing', feedbackMessage: null }));
  },

  removeBlock: (id: string) => {
    set((state) => ({ placedBlocks: state.placedBlocks.filter(b => b.id !== id), interactionState: 'playing', feedbackMessage: null }));
  },

  toggleBlockGhostState: (id: string) => {
    set((state) => ({ placedBlocks: state.placedBlocks.map(b => b.id === id ? { ...b, isGhosted: !b.isGhosted } : b) }));
  },

  useLifeline: () => {
    const state = get();
    if (!state.currentMathProblem || state.isLifelineUsed) return;
    const { num1, num2, operator } = state.currentMathProblem;
    if (operator === '+') {
      const blocks1 = generateBlocksForNumber(num1, 1);
      const blocks2 = generateBlocksForNumber(num2, 2);
      set({ isLifelineUsed: true, placedBlocks: [...blocks1, ...blocks2] });
    } else {
      const blocks = generateBlocksForSubtraction(num1, num2);
      set({ isLifelineUsed: true, placedBlocks: blocks });
    }
  },

  resetBoard: () => {
    const state = get();
    if (state.gameMode === 'math') {
      const limit = MATH_LIMITS[state.mathDifficulty];
      const operator = Math.random() > 0.5 ? '+' : '-';
      let n1, n2;
      if (operator === '+') {
        const sum = Math.floor(Math.random() * (limit - 1)) + 2; 
        n1 = Math.floor(Math.random() * (sum - 1)) + 1; n2 = sum - n1;
      } else {
        n1 = Math.floor(Math.random() * (limit - 1)) + 2; 
        n2 = Math.floor(Math.random() * (n1 - 1)) + 1; 
      }
      set({ currentMathProblem: { num1: n1, num2: n2, operator }, placedBlocks: [], isLifelineUsed: false, interactionState: 'playing', feedbackMessage: null });
    } else {
      const diff = state.difficulty;
      let target = 0;
      if (diff === 'tens') target = Math.floor(Math.random() * 90) + 10;
      else if (diff === 'hundreds') target = Math.floor(Math.random() * 900) + 100;
      else target = Math.floor(Math.random() * 9000) + 1000;
      
      set({ currentTargetNumber: target, placedBlocks: state.gameMode === 'recognize' ? generateBlocksForNumber(target) : [], interactionState: 'playing', feedbackMessage: null });
    }
  },

  checkMathAnswer: (inputNumber: number) => {
    const state = get();
    if (!state.currentMathProblem) return;
    const { num1, num2, operator } = state.currentMathProblem;
    const expected = operator === '+' ? num1 + num2 : num1 - num2;
    if (inputNumber === expected) {
      const reward = state.isLifelineUsed ? Math.ceil(MATH_REWARDS[state.mathDifficulty] / 2) : MATH_REWARDS[state.mathDifficulty];
      set({ interactionState: 'success', coinsCollected: state.coinsCollected + reward, feedbackMessage: `תשובה נכונה! הרווחת ${reward} כוכבים! ⭐` });
      repo.saveUserProgress(USER_ID, get());
      setTimeout(() => get().resetBoard(), 3000);
    } else {
      set({ interactionState: 'error', feedbackMessage: 'כמעט... נסי לחשב שוב!' });
    }
  },

  checkAnswer: () => {
    const state = get();
    const sum = state.placedBlocks.reduce((acc, b) => acc + b.value, 0);
    if (sum === state.currentTargetNumber) {
      const reward = state.difficulty === 'tens' ? 10 : state.difficulty === 'hundreds' ? 20 : 30;
      set({ interactionState: 'success', coinsCollected: state.coinsCollected + reward, feedbackMessage: `אלופה! הרווחת ${reward} כוכבים! ⭐` });
      repo.saveUserProgress(USER_ID, get());
      setTimeout(() => get().resetBoard(), 3000);
    } else {
      set({ interactionState: 'error', feedbackMessage: 'המספר לא מתאים, בואי ננסה שוב.' });
    }
  },

  checkRecognizeAnswer: (input: number) => {
    const state = get();
    if (input === state.currentTargetNumber) {
      const reward = state.difficulty === 'tens' ? 10 : state.difficulty === 'hundreds' ? 20 : 30;
      set({ interactionState: 'success', coinsCollected: state.coinsCollected + reward, feedbackMessage: `נכון מאוד! הרווחת ${reward} כוכבים! ⭐` });
      repo.saveUserProgress(USER_ID, get());
      setTimeout(() => get().resetBoard(), 3000);
    } else {
      set({ interactionState: 'error', feedbackMessage: 'לא בדיוק, בואי נספור שוב.' });
    }
  },

  buySticker: (id: string, cost: number) => {
    const state = get();
    if (state.coinsCollected >= cost && !state.unlockedStickers.includes(id)) {
      set({
        coinsCollected: state.coinsCollected - cost,
        unlockedStickers: [...state.unlockedStickers, id]
      });
      repo.saveUserProgress(USER_ID, get());
    }
  }
}));