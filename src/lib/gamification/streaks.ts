export function calculateStreak(lastPlayedDate: string | null, currentStreak: number): { streak: number; isNewDay: boolean } {
  const today = new Date().toISOString().split('T')[0];
  if (!lastPlayedDate) return { streak: 1, isNewDay: true };
  if (lastPlayedDate === today) return { streak: currentStreak, isNewDay: false };
  const lastDate = new Date(lastPlayedDate);
  const todayDate = new Date(today);
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return { streak: currentStreak + 1, isNewDay: true };
  return { streak: 1, isNewDay: true };
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🔥🔥🔥';
  if (streak >= 14) return '🔥🔥';
  if (streak >= 7) return '🔥';
  if (streak >= 3) return '✨';
  return '⚡';
}

export function getStreakMessage(streak: number): string {
  if (streak >= 30) return 'LEGENDARY STREAK!';
  if (streak >= 14) return 'AMAZING STREAK!';
  if (streak >= 7) return 'SUPER STREAK!';
  if (streak >= 3) return 'NICE STREAK!';
  if (streak === 1) return 'STREAK STARTED!';
  return '';
}
