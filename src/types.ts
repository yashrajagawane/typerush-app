export type Screen = 'dashboard' | 'lessons' | 'games' | 'progress' | 'profile' | 'race-game' | 'zombie-game' | 'matrix-game' | 'asteroid-game' | 'lesson-active' | 'daily-challenge';

export interface UserStats {
  level: number;
  xp: number;
  bestWpm: number;
  averageWpm: number;
  accuracy: number;
  totalWords: number;
  totalChars: number;
  totalTime: number;
  streak: number;
  lastPlayed: string | null;
  activeDays: string[];
  lastDailyChallenge: string | null;
  mistypedKeys: Record<string, number>; // key -> mistake count
  totalKeyStrokes: Record<string, number>; // key -> total strokes
  achievements: string[];
}

export interface UserProfile {
  name: string;
  avatar: string;
  keyboardTheme: 'default' | 'neon-blue' | 'crimson-red' | 'cyber-gold';
  soundEnabled: boolean;
}

export interface Lesson {
  id: string;
  level: number;
  title: string;
  description: string;
  targetKeys: string[];
  exercises: string[];
}

export interface LessonResult {
  wpm: number;
  accuracy: number;
  errors: number;
  time: number;
  xpEarned: number;
  isNewBest: boolean;
  combo: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}
