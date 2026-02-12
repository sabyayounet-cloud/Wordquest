'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useGame } from '@/providers/GameProvider';
import { getLevelTitle, getXPProgress } from '@/lib/gamification/xp';
import { getStreakEmoji } from '@/lib/gamification/streaks';
import { formatNumber } from '@/lib/utils';

export function StatsOverview() {
  const t = useTranslations('dashboard');
  const { state } = useGame();
  const xpProgress = getXPProgress(state.xp, state.level);
  const levelTitle = getLevelTitle(state.level);
  const avatarEmoji = getAvatarEmoji(state.profile?.avatarId);

  const stats = [
    { label: t('streak'), value: state.streak, icon: getStreakEmoji(state.streak), color: 'text-orange-400' },
    { label: t('totalXP'), value: formatNumber(state.xp), icon: '⭐', color: 'text-yellow-400' },
    { label: t('coins'), value: formatNumber(state.coins), icon: '💰', color: 'text-yellow-300' },
    { label: t('levelsCompleted'), value: Object.keys(state.completedLevels).length, icon: '📚', color: 'text-blue-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl">{avatarEmoji}</div>
        <div>
          <h1 className="text-2xl font-bold">
            {t('hello', { name: state.profile?.name || 'Player' })}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-purple-300">
              {t('yourLevel', { level: state.level })} - {levelTitle}
            </span>
          </div>
          {/* XP bar */}
          <div className="w-48 h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass rounded-xl p-3 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-white/40">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function getAvatarEmoji(avatarId?: string): string {
  const map: Record<string, string> = {
    dragon: '🐉', unicorn: '🦄', fox: '🦊', owl: '🦉', panda: '🐼', lion: '🦁',
    dolphin: '🐬', eagle: '🦅', wolf: '🐺', cat: '🐱', koala: '🐨', penguin: '🐧',
  };
  return map[avatarId || ''] || '🦸';
}
