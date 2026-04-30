export type PlaceValue = 'unit' | 'ten' | 'hundred' | 'thousand';
export type GameMode = 'build' | 'recognize';

export interface MontessoriBlock {
  id: string;
  type: PlaceValue;
  value: number; // 1, 10, 100, or 1000
}

export interface GameState {
  gameMode: GameMode;
  currentTargetNumber: number;
  placedBlocks: MontessoriBlock[];
  coinsCollected: number;
  consecutiveSuccesses: number;
  interactionState: 'playing' | 'validating' | 'success' | 'error';
  feedbackMessage: string | null; 
}

export interface IProgressRepository {
  getUserProgress(userId: string): Promise<GameState | null>;
  saveUserProgress(userId: string, state: GameState): Promise<void>;
}