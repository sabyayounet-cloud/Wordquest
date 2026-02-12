// Level thresholds - exponential curve
export const LEVEL_THRESHOLDS: number[] = Array.from({ length: 51 }, (_, i) => {
  if (i === 0) return 0;
  return Math.floor(50 * Math.pow(i, 1.8));
});

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Beginner',
  5: 'Explorer',
  10: 'Word Collector',
  15: 'Sentence Builder',
  20: 'Grammar Knight',
  25: 'Word Wizard',
  30: 'Language Hero',
  35: 'Master Scholar',
  40: 'Grand Master',
  45: 'Legend',
  50: 'Word Quest Champion',
};

export function getLevelTitle(level: number): string {
  const titles = Object.entries(LEVEL_TITLES)
    .sort(([a], [b]) => Number(b) - Number(a));
  for (const [threshold, title] of titles) {
    if (level >= Number(threshold)) return title;
  }
  return 'Beginner';
}

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i || 1;
  }
  return 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= 50) return LEVEL_THRESHOLDS[50];
  return LEVEL_THRESHOLDS[currentLevel + 1];
}

export function getXPProgress(xp: number, level: number): number {
  const currentThreshold = LEVEL_THRESHOLDS[level] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level + 1] || LEVEL_THRESHOLDS[50];
  const progress = (xp - currentThreshold) / (nextThreshold - currentThreshold);
  return Math.min(Math.max(progress, 0), 1);
}

export function calculateQuestionXP(
  correct: boolean,
  comboCount: number,
  timeTaken: number,
  streakMultiplier: number
): number {
  if (!correct) return 0;
  let xp = 10;
  xp += Math.min(comboCount * 2, 20);
  if (timeTaken < 5) xp += 5;
  xp = Math.floor(xp * streakMultiplier);
  return xp;
}

export function calculateLevelCompleteXP(
  correctAnswers: number,
  totalQuestions: number,
  perfectRun: boolean
): number {
  let xp = 50;
  if (perfectRun) xp += 100;
  const accuracy = correctAnswers / totalQuestions;
  if (accuracy >= 0.9) xp += 30;
  else if (accuracy >= 0.7) xp += 15;
  return xp;
}

export function calculateCoins(
  correctAnswers: number,
  totalQuestions: number,
  perfectRun: boolean
): number {
  const base = Math.floor((correctAnswers / totalQuestions) * 30);
  return perfectRun ? base + 20 : base + 10;
}

export function calculateStars(correctAnswers: number, totalQuestions: number): number {
  const ratio = correctAnswers / totalQuestions;
  if (ratio >= 0.95) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.5) return 1;
  return 0;
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.75;
  if (streak >= 7) return 1.5;
  if (streak >= 3) return 1.25;
  return 1.0;
}
