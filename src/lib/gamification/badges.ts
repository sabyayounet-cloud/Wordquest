import { Badge, GameState } from '@/types';

export const BADGES: Badge[] = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first level', icon: '👶', condition: { type: 'level_count', value: 1 }, rarity: 'common' },
  { id: 'ten-levels', name: 'Getting Started', description: 'Complete 10 levels', icon: '🎯', condition: { type: 'level_count', value: 10 }, rarity: 'common' },
  { id: 'fifty-levels', name: 'Dedicated Learner', description: 'Complete 50 levels', icon: '📚', condition: { type: 'level_count', value: 50 }, rarity: 'rare' },
  { id: 'hundred-levels', name: 'Century Club', description: 'Complete 100 levels', icon: '💯', condition: { type: 'level_count', value: 100 }, rarity: 'epic' },
  { id: 'xp-100', name: 'XP Beginner', description: 'Earn 100 XP', icon: '⭐', condition: { type: 'xp', value: 100 }, rarity: 'common' },
  { id: 'xp-1000', name: 'XP Hunter', description: 'Earn 1,000 XP', icon: '🌟', condition: { type: 'xp', value: 1000 }, rarity: 'rare' },
  { id: 'xp-5000', name: 'XP Master', description: 'Earn 5,000 XP', icon: '💫', condition: { type: 'xp', value: 5000 }, rarity: 'epic' },
  { id: 'xp-10000', name: 'XP Legend', description: 'Earn 10,000 XP', icon: '🏆', condition: { type: 'xp', value: 10000 }, rarity: 'legendary' },
  { id: 'streak-3', name: 'On Fire', description: '3-day streak', icon: '🔥', condition: { type: 'streak', value: 3 }, rarity: 'common' },
  { id: 'streak-7', name: 'Week Warrior', description: '7-day streak', icon: '🔥', condition: { type: 'streak', value: 7 }, rarity: 'rare' },
  { id: 'streak-30', name: 'Monthly Master', description: '30-day streak', icon: '🔥', condition: { type: 'streak', value: 30 }, rarity: 'epic' },
  { id: 'perfect-1', name: 'Perfect Score', description: 'Get a perfect score on any level', icon: '💎', condition: { type: 'perfect', value: 1 }, rarity: 'common' },
  { id: 'perfect-10', name: 'Perfectionist', description: 'Get 10 perfect scores', icon: '💎', condition: { type: 'perfect', value: 10 }, rarity: 'rare' },
  { id: 'perfect-50', name: 'Flawless', description: 'Get 50 perfect scores', icon: '💎', condition: { type: 'perfect', value: 50 }, rarity: 'legendary' },
  { id: 'vocab-master', name: 'Vocab Master', description: 'Complete all vocabulary levels', icon: '📖', condition: { type: 'module', value: 10, moduleSlug: 'vocabulary' }, rarity: 'epic' },
  { id: 'grammar-guru', name: 'Grammar Guru', description: 'Complete all grammar levels', icon: '✏️', condition: { type: 'module', value: 10, moduleSlug: 'grammar' }, rarity: 'epic' },
  { id: 'spelling-bee', name: 'Spelling Bee', description: 'Complete all spelling levels', icon: '🐝', condition: { type: 'module', value: 10, moduleSlug: 'spelling' }, rarity: 'epic' },
  { id: 'daily-7', name: 'Daily Devotee', description: 'Complete 7 daily challenges', icon: '📅', condition: { type: 'daily', value: 7 }, rarity: 'rare' },
  { id: 'daily-30', name: 'Daily Legend', description: 'Complete 30 daily challenges', icon: '📅', condition: { type: 'daily', value: 30 }, rarity: 'legendary' },
  { id: 'rich', name: 'Coin Collector', description: 'Earn 500 coins', icon: '💰', condition: { type: 'coins', value: 500 }, rarity: 'rare' },
  { id: 'wealthy', name: 'Treasure Hunter', description: 'Earn 2000 coins', icon: '💰', condition: { type: 'coins', value: 2000 }, rarity: 'epic' },
];

export function checkBadges(state: GameState): string[] {
  const newBadges: string[] = [];
  const completedCount = Object.keys(state.completedLevels).length;
  const perfectCount = Object.values(state.completedLevels).filter(l => l.perfectRun).length;

  for (const badge of BADGES) {
    if (state.badges.includes(badge.id)) continue;
    let earned = false;
    switch (badge.condition.type) {
      case 'level_count':
        earned = completedCount >= badge.condition.value;
        break;
      case 'xp':
        earned = state.xp >= badge.condition.value;
        break;
      case 'streak':
        earned = state.streak >= badge.condition.value;
        break;
      case 'perfect':
        earned = perfectCount >= badge.condition.value;
        break;
      case 'module':
        if (badge.condition.moduleSlug) {
          const moduleCompleted = Object.values(state.completedLevels)
            .filter(l => l.moduleSlug === badge.condition.moduleSlug).length;
          earned = moduleCompleted >= badge.condition.value;
        }
        break;
      case 'daily':
        earned = state.dailyChallengeCompleted.length >= badge.condition.value;
        break;
      case 'coins':
        earned = state.coins >= badge.condition.value;
        break;
    }
    if (earned) newBadges.push(badge.id);
  }
  return newBadges;
}

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}

export function getRarityColor(rarity: Badge['rarity']): string {
  switch (rarity) {
    case 'common': return 'from-gray-400 to-gray-500';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'epic': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-yellow-400 to-orange-500';
  }
}
