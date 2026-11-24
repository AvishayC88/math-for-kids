export type PlaceValue = 'unit' | 'ten' | 'hundred' | 'thousand';
export type GameMode = 'build' | 'recognize' | 'math'; 

export type DifficultyLevel = 'tens' | 'hundreds' | 'thousands';
export type MathDifficultyLevel = 'upTo10' | 'upTo20' | 'upTo100' | 'upTo1000';

export interface MontessoriBlock {
  id: string;
  type: PlaceValue;
  value: number;
  groupId?: number; 
  isGhosted?: boolean; 
}

export interface MathProblem {
  num1: number;
  num2: number;
  operator: '+' | '-' | '*' | '/';
}

export interface GameState {
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  mathDifficulty: MathDifficultyLevel; 
  lockedLevels: Record<string, boolean>; 
  allowedOperators: ('+' | '-' | '*' | '/')[];

  
  // Active view variables
  currentTargetNumber: number;
  currentMathProblem: MathProblem | null;
  isLifelineUsed: boolean;
  placedBlocks: MontessoriBlock[];

  // Background Persistence states for independent tabs
  savedBuildTarget?: number;
  savedBuildBlocks?: MontessoriBlock[];
  savedRecognizeTarget?: number;
  savedMathProblem?: MathProblem | null;
  savedMathBlocks?: MontessoriBlock[];
  savedMathLifeline?: boolean;

  coinsCollected: number; 
  unlockedStickers: string[];
  interactionState: 'playing' | 'success' | 'error';
  feedbackMessage: string | null;
  lastReward?: number; // stars earned by the last correct answer, shown while it is celebrated 
}

export interface IProgressRepository {
  getUserProgress(userId: string): Promise<GameState | null>;
  saveUserProgress(userId: string, state: GameState): Promise<void>;
}