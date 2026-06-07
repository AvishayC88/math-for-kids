import { create } from 'zustand';
import { MontessoriBlock, GameState, PlaceValue, GameMode, DifficultyLevel, MathDifficultyLevel } from '../domain/types';
import { LocalStorageRepository } from '../data/LocalStorageRepository';

const repo = new LocalStorageRepository();
const USER_ID = 'daughter_user_1';

const BUILD_LEVELS: DifficultyLevel[] = ['tens', 'hundreds', 'thousands'];
const MATH_LEVELS: MathDifficultyLevel[] = ['upTo10', 'upTo20', 'upTo100', 'upTo1000'];

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

interface GameStore extends GameState {
  initGame: () => Promise<void>;
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (level: DifficultyLevel) => void;
  setMathDifficulty: (level: MathDifficultyLevel) => void;
  toggleLevelLock: (levelId: string, type: 'build' | 'math') => void;
  addBlock: (type: PlaceValue) => void;
  removeBlock: (id: string) => void;
  toggleBlockGhostState: (id: string) => void;
  checkAnswer: () => void;
  checkRecognizeAnswer: (inputNumber: number) => void;
  checkMathAnswer: (inputNumber: number) => void;
  skipProblem: () => void;
  useLifeline: () => void;
  resetBoard: () => void;
  buySticker: (stickerId: string, cost: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameMode: 'build', difficulty: 'tens', mathDifficulty: 'upTo10', lockedLevels: {},
  currentTargetNumber: 0, currentMathProblem: null, isLifelineUsed: false,
  placedBlocks: [], coinsCollected: 0, unlockedStickers: [],
  consecutiveSuccesses: 0, interactionState: 'playing', feedbackMessage: null,

  initGame: async () => {
    const savedProgress = await repo.getUserProgress(USER_ID);
    if (savedProgress) {
      set({ ...savedProgress, unlockedStickers: savedProgress.unlockedStickers || [], lockedLevels: savedProgress.lockedLevels || {}, interactionState: 'playing', feedbackMessage: null });
      
      const state = get();
      if (state.gameMode === 'recognize') {
          if (!state.currentTargetNumber && !state.savedRecognizeTarget) get().resetBoard();
          else set({ currentTargetNumber: state.currentTargetNumber || state.savedRecognizeTarget, placedBlocks: generateBlocksForNumber(state.currentTargetNumber || state.savedRecognizeTarget!) });
      } else if (state.gameMode === 'math') {
          if (!state.currentMathProblem && !state.savedMathProblem) get().resetBoard();
          else if (state.isLifelineUsed) {
              set({ isLifelineUsed: false }); 
              get().useLifeline();
          }
      } else if (state.gameMode === 'build') {
          if (!state.currentTargetNumber && !state.savedBuildTarget) get().resetBoard();
      }
    } else {
      get().resetBoard();
    }
  },

  setGameMode: (mode: GameMode) => { 
    const state = get();
    if (state.gameMode === mode) return;

    const updates: Partial<GameStore> = {};
    if (state.gameMode === 'build') {
        updates.savedBuildTarget = state.currentTargetNumber;
        updates.savedBuildBlocks = state.placedBlocks;
    } else if (state.gameMode === 'recognize') {
        updates.savedRecognizeTarget = state.currentTargetNumber;
    } else if (state.gameMode === 'math') {
        updates.savedMathProblem = state.currentMathProblem;
        updates.savedMathBlocks = state.placedBlocks;
        updates.savedMathLifeline = state.isLifelineUsed;
    }

    updates.gameMode = mode;
    updates.interactionState = 'playing';
    updates.feedbackMessage = null;
    set(updates);

    const newState = get();
    if (mode === 'build') {
        if (!newState.savedBuildTarget) get().resetBoard();
        else set({ currentTargetNumber: newState.savedBuildTarget, placedBlocks: newState.savedBuildBlocks || [] });
    } else if (mode === 'recognize') {
        if (!newState.savedRecognizeTarget) get().resetBoard();
        else set({ currentTargetNumber: newState.savedRecognizeTarget, placedBlocks: generateBlocksForNumber(newState.savedRecognizeTarget) });
    } else if (mode === 'math') {
        if (!newState.savedMathProblem) get().resetBoard();
        else set({ currentMathProblem: newState.savedMathProblem, placedBlocks: newState.savedMathBlocks || [], isLifelineUsed: newState.savedMathLifeline || false });
    }

    repo.saveUserProgress(USER_ID, get());
  },

  setDifficulty: (level: DifficultyLevel) => { set({ difficulty: level }); get().resetBoard(); },
  setMathDifficulty: (level: MathDifficultyLevel) => { set({ mathDifficulty: level }); get().resetBoard(); },
  
  toggleLevelLock: (levelId: string, type: 'build' | 'math') => {
    set((state) => {
      const isCurrentlyLocked = !!state.lockedLevels[levelId];
      if (!isCurrentlyLocked) {
        const allLevels = type === 'build' ? BUILD_LEVELS as string[] : MATH_LEVELS as string[];
        const unlockedCount = allLevels.filter(l => l !== levelId && !state.lockedLevels[l]).length;
        if (unlockedCount === 0) return state; 
      }
      const newLockedLevels = { ...state.lockedLevels, [levelId]: !isCurrentlyLocked };
      const newState: Partial<GameStore> = { lockedLevels: newLockedLevels };
      if (!isCurrentlyLocked) {
        if (type === 'build' && state.difficulty === levelId) newState.difficulty = BUILD_LEVELS.find(l => !newLockedLevels[l]) as DifficultyLevel;
        else if (type === 'math' && state.mathDifficulty === levelId) newState.mathDifficulty = MATH_LEVELS.find(l => !newLockedLevels[l]) as MathDifficultyLevel;
      }
      return newState;
    });
    repo.saveUserProgress(USER_ID, get());
    get().resetBoard();
  },

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

  skipProblem: () => {
    const state = get();
    if (state.coinsCollected >= 10 && state.interactionState !== 'success') {
      set({ coinsCollected: state.coinsCollected - 10, interactionState: 'playing', feedbackMessage: null });
      get().resetBoard();
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
      set({ 
          currentMathProblem: { num1: n1, num2: n2, operator }, 
          placedBlocks: [], 
          isLifelineUsed: false, 
          interactionState: 'playing', 
          feedbackMessage: null,
          savedMathProblem: { num1: n1, num2: n2, operator }, 
          savedMathBlocks: [],
          savedMathLifeline: false
      });
    } else {
      const diff = state.difficulty;
      let target = 0;
      
      if (diff === 'tens') {
        target = Math.floor(Math.random() * 99) + 1;
      } else if (diff === 'hundreds') {
        const isTens = Math.random() < 0.20; 
        target = isTens ? Math.floor(Math.random() * 90) + 10 : Math.floor(Math.random() * 900) + 100;
      } else if (diff === 'thousands') {
        const isHundreds = Math.random() < 0.20; 
        target = isHundreds ? Math.floor(Math.random() * 900) + 100 : Math.floor(Math.random() * 9000) + 1000;
      }
      
      const blocks = state.gameMode === 'recognize' ? generateBlocksForNumber(target) : [];
      
      if (state.gameMode === 'recognize') {
          set({ currentTargetNumber: target, placedBlocks: blocks, interactionState: 'playing', feedbackMessage: null, savedRecognizeTarget: target });
      } else {
          set({ currentTargetNumber: target, placedBlocks: blocks, interactionState: 'playing', feedbackMessage: null, savedBuildTarget: target, savedBuildBlocks: [] });
      }
    }
    repo.saveUserProgress(USER_ID, get());
  },

  checkMathAnswer: (inputNumber: number) => {
    const state = get();
    if (!state.currentMathProblem) return;
    const { num1, num2, operator } = state.currentMathProblem;
    const expected = operator === '+' ? num1 + num2 : num1 - num2;
    
    if (inputNumber === expected) {
      const maxNumInvolved = operator === '+' ? expected : num1; 
      let baseReward = 10; 
      if (maxNumInvolved > 100) baseReward = 30;
      else if (maxNumInvolved > 20) baseReward = 20;
      else if (maxNumInvolved > 10) baseReward = 15;

      const finalReward = state.isLifelineUsed ? Math.ceil(baseReward / 2) : baseReward;
      
      set({ interactionState: 'success', coinsCollected: state.coinsCollected + finalReward, feedbackMessage: `תשובה נכונה! הרווחתם ${finalReward} כוכבים! ⭐` });
      repo.saveUserProgress(USER_ID, get());
      setTimeout(() => get().resetBoard(), 3000);
    } else {
      set({ interactionState: 'error', feedbackMessage: 'כמעט... נסו לחשב שוב!' });
    }
  },

  // ARCHITECT FIX: Dynamic rewards based on actual number for Build mode
  checkAnswer: () => { 
    const state = get();
    const sum = state.placedBlocks.reduce((acc, b) => acc + b.value, 0);
    if (sum === state.currentTargetNumber) {
      let reward = 10;
      if (state.currentTargetNumber >= 1000) reward = 30;
      else if (state.currentTargetNumber >= 100) reward = 20;

      set({ interactionState: 'success', coinsCollected: state.coinsCollected + reward, feedbackMessage: `כל הכבוד! הרווחתם ${reward} כוכבים! ⭐` });
      repo.saveUserProgress(USER_ID, get());
      setTimeout(() => get().resetBoard(), 3000);
    } else {
      set({ interactionState: 'error', feedbackMessage: 'המספר לא מתאים, בואו ננסה שוב.' });
    }
  },

  // ARCHITECT FIX: Dynamic rewards based on actual number for Recognize mode
  checkRecognizeAnswer: (input: number) => { 
    const state = get();
    if (input === state.currentTargetNumber) {
      let reward = 10;
      if (state.currentTargetNumber >= 1000) reward = 30;
      else if (state.currentTargetNumber >= 100) reward = 20;

      set({ interactionState: 'success', coinsCollected: state.coinsCollected + reward, feedbackMessage: `נכון מאוד! הרווחתם ${reward} כוכבים! ⭐` });
      repo.saveUserProgress(USER_ID, get());
      setTimeout(() => get().resetBoard(), 3000);
    } else {
      set({ interactionState: 'error', feedbackMessage: 'לא בדיוק, בואו נספור שוב.' });
    }
  },

  buySticker: (id: string, cost: number) => {
    const state = get();
    if (state.coinsCollected >= cost && !state.unlockedStickers.includes(id)) {
      set({ coinsCollected: state.coinsCollected - cost, unlockedStickers: [...state.unlockedStickers, id] });
      repo.saveUserProgress(USER_ID, get());
    }
  }
}));