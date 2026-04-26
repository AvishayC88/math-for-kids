// Defines the valid categories for Montessori blocks
export type PlaceValue = 'unit' | 'ten';

// Represents a single visual block on the board
export interface MontessoriBlock {
  id: string;
  type: PlaceValue;
  value: number; // 1 for unit, 10 for ten
}

// Represents the user's progress and the adaptive learning engine state
export interface GameState {
  currentTargetNumber: number;
  placedBlocks: MontessoriBlock[];
  coinsCollected: number;
  consecutiveSuccesses: number;
  // Status flag for the UI to determine animations
  interactionState: 'playing' | 'validating' | 'success' | 'error';
}

// The data layer abstraction for future .NET backend integration
export interface IProgressRepository {
  getUserProgress(userId: string): Promise<GameState | null>;
  saveUserProgress(userId: string, state: GameState): Promise<void>;
}
