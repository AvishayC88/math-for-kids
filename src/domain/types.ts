export type PlaceValue = 'unit' | 'ten' | 'hundred' | 'thousand';
export type GameMode = 'build' | 'recognize';
export type DifficultyLevel = 'tens' | 'hundreds' | 'thousands';

export interface MontessoriBlock {
  id: string;
  type: PlaceValue;
  value: number;
}

export interface GameState {
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  currentTargetNumber: number;
  placedBlocks: MontessoriBlock[];
  coinsCollected: number; // Keeping variable name for backward compatibility, visually it's "stars"
  unlockedStickers: string[]; // NEW: Array of sticker IDs
  consecutiveSuccesses: number;
  interactionState: 'playing' | 'validating' | 'success' | 'error';
  feedbackMessage: string | null; 
}

export interface IProgressRepository {
  getUserProgress(userId: string): Promise<GameState | null>;
  saveUserProgress(userId: string, state: GameState): Promise<void>;
}