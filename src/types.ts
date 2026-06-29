export interface ColumnSchema {
  name: string;
  type: string;
  description?: string;
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  rowCount?: number;
}

export interface Level {
  id: number;
  title: string;
  concept: string; // e.g., 'SELECT', 'WHERE', etc.
  story: string;
  objective: string;
  databaseSchema: TableSchema[];
  hints: string[];
  initialQuery: string;
  expectedQuery: string;
  sqlSetup?: string; // Runs arbitrary creation/seeding SQL for custom generated levels
}

export interface QueryResult {
  columns: string[];
  values: any[][];
}

export interface RunQueryResult {
  columns: string[];
  values: any[][];
  error?: string;
}

export interface GameProgress {
  completedLevels: number[]; // Array of completed level IDs
  highestScore: number;
  totalScore: number;
  currentLevelId: number;
  hintsUsedCount: { [levelId: number]: number }; // Maps levelId to number of hints used (0-3)
  levelScores: { [levelId: number]: number }; // Score obtained per level
  attemptsCount: { [levelId: number]: number }; // Maps levelId to count of queries executed
  
  // Custom Progression Systems
  username?: string;
  selectedAvatar?: string;
  xp: number;
  level: number;
  credits: number;
  evidencePoints: number;
  unlockedAvatars: string[];
  achievements: string[];
  streak: number;
  lastActiveDate?: string;
  statistics: {
    casesSolved: number;
    hintsUnlocked: number;
    totalAttempts: number;
    creditsSpent: number;
    highestStreak: number;
  };
}

export interface GameSettings {
  soundEnabled: boolean;
  theme: 'dark'; // Dark modern interface by default
}
