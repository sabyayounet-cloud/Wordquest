import { ModuleSlug } from '@/types';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function dateToSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const DAILY_MODULES: ModuleSlug[] = ['vocabulary', 'spelling', 'sentences', 'grammar', 'reading'];

export function getDailyChallengeModule(date: string): ModuleSlug {
  const seed = dateToSeed(date);
  const rng = seededRandom(seed);
  const index = Math.floor(rng() * DAILY_MODULES.length);
  return DAILY_MODULES[index];
}

export function getDailyChallengeSeed(date: string): number {
  return dateToSeed(date);
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isDailyChallengeCompleted(completedDates: string[]): boolean {
  const today = getTodayDateString();
  return completedDates.includes(today);
}

export function getDailyChallengeStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort().reverse();
  const today = getTodayDateString();
  if (sorted[0] !== today) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diff) === 1) streak++;
    else break;
  }
  return streak;
}
