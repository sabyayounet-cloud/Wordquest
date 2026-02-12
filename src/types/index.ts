export type AgeGroup = '4-6' | '7-9' | '10-12' | '13-15';

export type Language = 'en' | 'de' | 'nl';

export type ModuleSlug = 'phonics' | 'vocabulary' | 'spelling' | 'sentences' | 'grammar' | 'reading' | 'writing';

export type QuestionType = 'multiple-choice' | 'drag-and-drop' | 'typing' | 'match-pairs' | 'fill-in-blank' | 'true-false';

export interface UserProfile {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  avatarId: string;
  uiLanguage: Language;
  learningLanguage: Language;
  createdAt: string;
}

export interface GameState {
  profile: UserProfile | null;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastPlayedDate: string | null;
  hearts: number;
  completedLevels: Record<string, CompletedLevel>;
  badges: string[];
  dailyChallengeCompleted: string[];
  shopPurchases: string[];
  comboCount: number;
}

export interface CompletedLevel {
  moduleSlug: ModuleSlug;
  levelId: string;
  stars: number; // 1-3
  bestScore: number;
  completedAt: string;
  perfectRun: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  ageGroups: AgeGroup[];
  difficulty: number; // 1-5
  prompt: string;
  hint?: string;
  imageUrl?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  words?: string[]; // for drag-and-drop
  pairs?: { left: string; right: string }[]; // for match-pairs
  sentence?: string; // for fill-in-blank
  blankIndex?: number;
}

export interface LevelData {
  id: string;
  moduleSlug: ModuleSlug;
  title: string;
  description: string;
  ageGroup: AgeGroup;
  difficulty: number;
  questions: Question[];
  requiredCorrect: number; // minimum correct to pass
  timeLimit?: number; // seconds, optional
}

export interface ModuleInfo {
  slug: ModuleSlug;
  title: string;
  description: string;
  icon: string;
  color: string;
  ageGroups: AgeGroup[];
  totalLevels: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: BadgeCondition;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface BadgeCondition {
  type: 'xp' | 'streak' | 'perfect' | 'module' | 'level_count' | 'daily' | 'speed' | 'polyglot' | 'coins';
  value: number;
  moduleSlug?: ModuleSlug;
}

export interface LevelResult {
  levelId: string;
  moduleSlug: ModuleSlug;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  coinsEarned: number;
  timeSpent: number;
  perfectRun: boolean;
  newBadges: string[];
  leveledUp: boolean;
  newLevel?: number;
  stars: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'avatar' | 'theme' | 'powerup';
  cost: number;
  icon: string;
}

export interface DailyChallenge {
  date: string;
  moduleSlug: ModuleSlug;
  questions: Question[];
  bonusXP: number;
}
