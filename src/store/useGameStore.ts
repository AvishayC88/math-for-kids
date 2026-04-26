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
    const newBlock: MontessoriBlock = {
      id: Math.random().toString(36).substring(2, 11),
      type: type,
      value: type === 'ten' ? 10 : 1,
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
    // Adaptive logic: increase difficulty based on consecutive successes
    const successes = get().consecutiveSuccesses;
    const maxRange = successes > 5 ? 100 : 20; 
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
      
      // Persist progress
      repo.saveUserProgress(USER_ID, get());
      
      // Reset board after a delay to allow the success animation to play
      setTimeout(() => get().resetBoard(), 3000);
    } else {
      // Validation failed - implement Montessori control of error
      // We change the state to error but keep the blocks so the user can correct the mistake
      set({ interactionState: 'error' });
    }
  }
}));
