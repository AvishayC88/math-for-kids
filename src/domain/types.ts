export type PlaceValue = 'unit' | 'ten' | 'hundred' | 'thousand';
export type GameMode = 'build' | 'recognize' | 'math'; 

export type DifficultyLevel = 'tens' | 'hundreds' | 'thousands';
export type MathDifficultyLevel = 'upTo10' | 'upTo20' | 'upTo100' | 'upTo1000';

export interface MontessoriBlock {
  id: string;
  type: PlaceValue;
  value: number;
  groupId?: 1 | 2; // Used to separate blocks visually in addition
  isGhosted?: boolean; // Used for the toggle mechanism in subtraction
}

export interface MathProblem {
  num1: number;
  num2: number;
  operator: '+' | '-';
}

export interface GameState {
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  mathDifficulty: MathDifficultyLevel; 
  currentTargetNumber: number;
  currentMathProblem: MathProblem | null;
  isLifelineUsed: boolean;
  placedBlocks: MontessoriBlock[];
  coinsCollected: number; 
  unlockedStickers: string[];
  consecutiveSuccesses: number;
  interactionState: 'playing' | 'validating' | 'success' | 'error';
  feedbackMessage: string | null; 
}

export interface IProgressRepository {
  getUserProgress(userId: string): Promise<GameState | null>;
  saveUserProgress(userId: string, state: GameState): Promise<void>;
}