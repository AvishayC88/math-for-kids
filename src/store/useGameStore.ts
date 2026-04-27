import { create } from 'zustand';
import { MontessoriBlock, GameState, PlaceValue } from '../domain/types';
import { LocalStorageRepository } from '../data/LocalStorageRepository';

const repo = new LocalStorageRepository();
const USER_ID = 'daughter_user_1';

interface GameStore extends GameState {
  initGame: () => Promise<void>;
  addBlock: (type: PlaceValue) => void;
  removeBlock: (id: string) => void;
  checkAnswer: () => void;
  resetBoard: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentTargetNumber: 0,
  placedBlocks: [],
  coinsCollected: 0,
  consecutiveSuccesses: 0,
  interactionState: 'playing',
  feedbackMessage: null,

  initGame: async () => {
    const savedProgress = await repo.getUserProgress(USER_ID);
    if (savedProgress) {
      set({ ...savedProgress, interactionState: 'playing', feedbackMessage: null });
    } else {
      get().resetBoard();
    }
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
      feedbackMessage: null // Clear errors when user tries to fix the board
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
    const successes = get().consecutiveSuccesses;
    let maxRange = 20; 
    
    if (successes >= 10) maxRange = 9999; 
    else if (successes >= 5) maxRange = 999; 

    const newTarget = Math.floor(Math.random() * (maxRange - 1)) + 1;

    set({
      currentTargetNumber: newTarget,
      placedBlocks: [],
      interactionState: 'playing',
      feedbackMessage: null
    });
  },

  checkAnswer: () => {
    const state = get();
    const currentSum = state.placedBlocks.reduce((acc, b) => acc + b.value, 0);

    // Group blocks to check Montessori rules
    const unitsCount = state.placedBlocks.filter(b => b.type === 'unit').length;
    const tensCount = state.placedBlocks.filter(b => b.type === 'ten').length;
    const hundredsCount = state.placedBlocks.filter(b => b.type === 'hundred').length;

    // Identify if any column exceeds the allowed limit
    let overLimitColumn = '';
    let requiredExchange = '';

    if (unitsCount >= 10) {
      overLimitColumn = 'אחדות';
      requiredExchange = 'עשרת אחת';
    } else if (tensCount >= 10) {
      overLimitColumn = 'עשרות';
      requiredExchange = 'מאה אחת';
    } else if (hundredsCount >= 10) {
      overLimitColumn = 'מאות';
      requiredExchange = 'אלף אחד';
    }

    if (currentSum === state.currentTargetNumber) {
      if (overLimitColumn) {
        // Mathematical success, but structural failure (Needs Exchange)
        set({ 
          interactionState: 'error', 
          feedbackMessage: `הסכום נכון! אבל יש לנו יותר מ-9 ${overLimitColumn}. בואי נחליף 10 ${overLimitColumn} ב${requiredExchange}.`
        });
      } else {
        // Absolute success
        const newSuccessCount = state.consecutiveSuccesses + 1;
        set({
          interactionState: 'success',
          consecutiveSuccesses: newSuccessCount,
          coinsCollected: state.coinsCollected + 10,
          feedbackMessage: null
        });
        
        repo.saveUserProgress(USER_ID, get());
        setTimeout(() => get().resetBoard(), 3000);
      }
    } else {
      // Standard mathematical error
      set({ 
        interactionState: 'error',
        feedbackMessage: 'המספר על הלוח לא מתאים. בואי נספור שוב את הבלוקים ששמת.'
      });
    }
  }
}));
