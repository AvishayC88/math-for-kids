import { create } from 'zustand';
import { MontessoriBlock, GameState, PlaceValue, GameMode, DifficultyLevel } from '../domain/types';
import { LocalStorageRepository } from '../data/LocalStorageRepository';

const repo = new LocalStorageRepository();
const USER_ID = 'daughter_user_1';

// Helper to generate physical blocks from an abstract number
function generateBlocksForNumber(num: number): MontessoriBlock[] {
  const blocks: MontessoriBlock[] = [];
  let remaining = num;

  const thousands = Math.floor(remaining / 1000);
  remaining %= 1000;
  for(let i=0; i<thousands; i++) blocks.push({ id: Math.random().toString(), type: 'thousand', value: 1000 });

  const hundreds = Math.floor(remaining / 100);
  remaining %= 100;
  for(let i=0; i<hundreds; i++) blocks.push({ id: Math.random().toString(), type: 'hundred', value: 100 });

  const tens = Math.floor(remaining / 10);
  remaining %= 10;
  for(let i=0; i<tens; i++) blocks.push({ id: Math.random().toString(), type: 'ten', value: 10 });

  const units = remaining;
  for(let i=0; i<units; i++) blocks.push({ id: Math.random().toString(), type: 'unit', value: 1 });

  return blocks;
}

// ARCHITECT NOTE: Helper to calculate dynamic rewards
function getRewardAmount(difficulty: DifficultyLevel): number {
  if (difficulty === 'thousands') return 30;
  if (difficulty === 'hundreds') return 20;
  return 10;
}

interface GameStore extends GameState {
  initGame: () => Promise<void>;
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (level: DifficultyLevel) => void;
  addBlock: (type: PlaceValue) => void;
  removeBlock: (id: string) => void;
  checkAnswer: () => void;
  checkRecognizeAnswer: (inputNumber: number) => void;
  resetBoard: () => void;
  buySticker: (stickerId: string, cost: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameMode: 'build',
  difficulty: 'tens',
  currentTargetNumber: 0,
  placedBlocks: [],
  coinsCollected: 0,
  unlockedStickers: [],
  consecutiveSuccesses: 0,
  interactionState: 'playing',
  feedbackMessage: null,

  initGame: async () => {
    const savedProgress = await repo.getUserProgress(USER_ID);
    if (savedProgress) {
      // Ensure unlockedStickers array exists for returning users with old save data
      set({ ...savedProgress, unlockedStickers: savedProgress.unlockedStickers || [], interactionState: 'playing', feedbackMessage: null });
    } else {
      get().resetBoard();
    }
  },

  setGameMode: (mode: GameMode) => {
    set({ gameMode: mode });
    get().resetBoard();
  },

  setDifficulty: (level: DifficultyLevel) => {
    set({ difficulty: level });
    repo.saveUserProgress(USER_ID, get());
    get().resetBoard();
  },

  addBlock: (type: PlaceValue) => {
    let blockValue = 1;
    if (type === 'thousand') blockValue = 1000;
    else if (type === 'hundred') blockValue = 100;
    else if (type === 'ten') blockValue = 10;

    const newBlock: MontessoriBlock = {
      id: Math.random().toString(36).substring(2, 11),
      type: type,
      value: blockValue,
    };
    
    set((state) => ({
      placedBlocks: [...state.placedBlocks, newBlock],
      interactionState: 'playing',
      feedbackMessage: null
    }));
  },

  removeBlock: (id: string) => {
    set((state) => ({
      placedBlocks: state.placedBlocks.filter(b => b.id !== id),
      interactionState: 'playing',
      feedbackMessage: null
    }));
  },

  resetBoard: () => {
    const diff = get().difficulty;
    let newTarget = 0;
    
    if (diff === 'tens') {
      newTarget = Math.floor(Math.random() * 99) + 1;
    } else if (diff === 'hundreds') {
      const isTens = Math.random() < 0.35;
      newTarget = isTens ? Math.floor(Math.random() * 90) + 10 : Math.floor(Math.random() * 900) + 100;
    } else if (diff === 'thousands') {
      const isHundreds = Math.random() < 0.35;
      newTarget = isHundreds ? Math.floor(Math.random() * 900) + 100 : Math.floor(Math.random() * 9000) + 1000;
    }

    const mode = get().gameMode;

    if (mode === 'build') {
      set({
        currentTargetNumber: newTarget,
        placedBlocks: [],
        interactionState: 'playing',
        feedbackMessage: null
      });
    } else {
      const generatedBlocks = generateBlocksForNumber(newTarget);
      set({
        currentTargetNumber: newTarget,
        placedBlocks: generatedBlocks,
        interactionState: 'playing',
        feedbackMessage: null
      });
    }
  },

  checkAnswer: () => {
    const state = get();
    const currentSum = state.placedBlocks.reduce((acc, b) => acc + b.value, 0);

    const unitsCount = state.placedBlocks.filter(b => b.type === 'unit').length;
    const tensCount = state.placedBlocks.filter(b => b.type === 'ten').length;
    const hundredsCount = state.placedBlocks.filter(b => b.type === 'hundred').length;

    let overLimitColumn = '';
    let requiredExchange = '';

    if (unitsCount >= 10) { overLimitColumn = 'אחדות'; requiredExchange = 'עשרת אחת'; } 
    else if (tensCount >= 10) { overLimitColumn = 'עשרות'; requiredExchange = 'מאה אחת'; } 
    else if (hundredsCount >= 10) { overLimitColumn = 'מאות'; requiredExchange = 'אלף אחד'; }

    if (currentSum === state.currentTargetNumber) {
      if (overLimitColumn) {
        set({ interactionState: 'error', feedbackMessage: `הסכום נכון! אבל יש לנו יותר מ-9 ${overLimitColumn}. בואי נחליף 10 ${overLimitColumn} ב${requiredExchange}.`});
      } else {
        const reward = getRewardAmount(state.difficulty);
        set({ 
          interactionState: 'success', 
          consecutiveSuccesses: state.consecutiveSuccesses + 1, 
          coinsCollected: state.coinsCollected + reward, 
          feedbackMessage: `אלופה! הרווחת ${reward} כוכבים! ⭐`
        });
        repo.saveUserProgress(USER_ID, get());
        setTimeout(() => get().resetBoard(), 3000);
      }
    } else {
      set({ interactionState: 'error', feedbackMessage: 'המספר על הלוח לא מתאים. בואי נספור שוב את הבלוקים ששמת.'});
    }
  },

  checkRecognizeAnswer: (inputNumber: number) => {
    const state = get();
    if (inputNumber === state.currentTargetNumber) {
      const reward = getRewardAmount(state.difficulty);
      set({ 
        interactionState: 'success', 
        consecutiveSuccesses: state.consecutiveSuccesses + 1, 
        coinsCollected: state.coinsCollected + reward, 
        feedbackMessage: `אלופה! הרווחת ${reward} כוכבים! ⭐`
      });
      repo.saveUserProgress(USER_ID, get());
      setTimeout(() => get().resetBoard(), 3000);
    } else {
      set({ interactionState: 'error', feedbackMessage: 'כמעט! בואי נספור שוב כמה קוביות יש מכל סוג.'});
    }
  },

  buySticker: (stickerId: string, cost: number) => {
    const state = get();
    // Double check affordability and lock status
    if (state.coinsCollected >= cost && !state.unlockedStickers.includes(stickerId)) {
      set({
        coinsCollected: state.coinsCollected - cost,
        unlockedStickers: [...state.unlockedStickers, stickerId]
      });
      repo.saveUserProgress(USER_ID, get());
    }
  }
}));