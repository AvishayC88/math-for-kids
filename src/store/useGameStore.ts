import { create } from 'zustand';
import { MontessoriBlock, GameState, PlaceValue } from '../domain/types';
import { LocalStorageRepository } from '../data/LocalStorageRepository';

const repo = new LocalStorageRepository();
const USER_ID = 'daughter_user_1'; // נחליף ב-ID אמיתי כשיהיה שרת

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
      get().resetBoard(); // הגרלת מספר ראשון
    }
  },

  addBlock: (type: PlaceValue) => {
    const newBlock: MontessoriBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      value: type === 'ten' ? 10 : 1,
    };
    set((state) => ({
      placedBlocks: [...state.placedBlocks, newBlock],
      interactionState: 'playing' // איפוס מצב שגיאה אם היא מוסיפה בלוק
    }));
  },

  removeBlock: (id: string) => {
    set((state) => ({
      placedBlocks: state.placedBlocks.filter(b => b.id !== id)
    }));
  },

  resetBoard: () => {
    // לוגיקה אדפטיבית בסיסית: ככל שהיא מצליחה יותר, המספרים גדלים
    const successes = get().consecutiveSuccesses;
    const maxRange = successes > 5 ? 100 : 20; // קפיצה מ-20 ל-100 אחרי 5 הצלחות
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
      // הצלחה!
      const newSuccessCount = state.consecutiveSuccesses + 1;
      set({
        interactionState: 'success',
        consecutiveSuccesses: newSuccessCount,
        coinsCollected: state.coinsCollected + 10
      });
      
      // שמירה ל-LocalStorage
      repo.saveUserProgress(USER_ID, get());
      
      // איפוס לוח אחרי השהייה (כדי שתוכל לראות את ה"קסם")
      setTimeout(() => get().resetBoard(), 3000);
    } else {
      // טעות - מימוש "בקרת טעות" מונטסורית
      set({ interactionState: 'error' });
      // אנחנו לא מאפסים את הלוח, נותנים לה לתקן
    }
  }
}));
