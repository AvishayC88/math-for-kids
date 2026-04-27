import { create } from 'zustand';
import { MontessoriBlock, GameState, PlaceValue } from '../domain/types';
import { LocalStorageRepository } from '../data/LocalStorageRepository';

const repo = new LocalStorageRepository();
const USER_ID = 'daughter_user_1'; // Replace with a real user ID when migrating to .NET backend

interface GameStore extends GameState {
  // Actions
  initGame: () => Promise<void>;
  addBlock: (type: PlaceValue) => void;
  removeBlock: (id: string) => void;
  checkAnswer: () => void;
  resetBoard: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  currentTargetNumber: 0,
  placedBlocks: [],
  coinsCollected: 0,
  consecutiveSuccesses: 0,
  interactionState: 'playing',

  initGame: async () => {
    const savedProgress = await repo.getUserProgress(USER_ID);
    if (savedProgress) {
      set({ ...savedProgress, interactionState: 'playing' });
    } else {
      get().resetBoard(); // Initial target generation
    }
  },

  addBlock: (type: PlaceValue) => {
    // Determine the numerical value based on the block type
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
      interactionState: 'playing' // Clear error state when the user tries to fix the board
    }));
  },

  removeBlock: (id: string) => {
    set((state) => ({
      placedBlocks: state.placedBlocks.filter(b => b.id !== id)
    }));
  },

  resetBoard: () => {
    const successes = get().consecutiveSuccesses;
    
    // Adaptive engine: Expand the number range based on the child's streak
    let maxRange = 20; // Default starting range
    
    if (successes >= 10) {
      maxRange = 9999; // Enter thousands after 10 consecutive successes
    } else if (successes >= 5) {
      maxRange = 999; // Enter hundreds after 5 consecutive successes
    }

    const newTarget = Math.floor(Math.random() * (maxRange - 1)) + 1;

    set({
      currentTargetNumber: newTarget,
      placedBlocks: [],
      interactionState: 'playing'
    });
  },

  checkAnswer: () => {
    const state = get();
    const currentSum = state.placedBlocks.reduce((acc, b) => acc + b.value, 0);

    if (currentSum === state.currentTargetNumber) {
      // Success criteria met
      const newSuccessCount = state.consecutiveSuccesses + 1;
      
      set({
        interactionState: 'success',
        consecutiveSuccesses: newSuccessCount,
        coinsCollected: state.coinsCollected + 10
      });
      
      // Persist progress to local storage
      repo.saveUserProgress(USER_ID, get());
      
      // Reset board after a delay to allow the success animation to play
      setTimeout(() => get().resetBoard(), 3000);
    } else {
      // Validation failed - implement Montessori control of error
      // Change the state to error but keep the blocks so the user can correct the mistake
      set({ interactionState: 'error' });
    }
  }
}));
