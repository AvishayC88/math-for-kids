// Expanded to include hundreds and thousands
export type PlaceValue = 'unit' | 'ten' | 'hundred' | 'thousand';

export interface MontessoriBlock {
  id: string;
  type: PlaceValue;
  value: number; // 1, 10, 100, or 1000
  feedbackMessage: string | null;
}

export interface GameState {
  currentTargetNumber: number;
  placedBlocks: MontessoriBlock[];
  coinsCollected: number;
  consecutiveSuccesses: number;
  interactionState: 'playing' | 'validating' | 'success' | 'error';
}

export interface IProgressRepository {
  getUserProgress(userId: string): Promise<GameState | null>;
  saveUserProgress(userId: string, state: GameState): Promise<void>;
}
