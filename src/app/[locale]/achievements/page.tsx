'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useGame } from '@/providers/GameProvider';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { BADGES, getRarityColor } from '@/lib/gamification/badges';

export default function AchievementsPage() {
  const t = useTranslations('achievements');
  const tRarity = useTranslations('achievements.rarity');
  const { state } = useGame();

  const earnedBadges = BADGES.filter(b => state.badges.includes(b.id));
  const lockedBadges = BADGES.filter(b => !state.badges.includes(b.id));

  return (
    <div className="min-h-screen pb-24 pt-16">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black mb-2">{t('title')}</h1>
          <p className="text-white/50 mb-6">
            {earnedBadges.length} / {BADGES.length} {t('badges')}
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(earnedBadges.length / BADGES.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        {/* Earned badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-green-400">✅ {t('earned')} ({earnedBadges.length})</h2>
            <div className="grid grid-cols-3 gap-3">
              {earnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  className={`glass rounded-2xl p-4 text-center relative overflow-hidden`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(badge.rarity)} opacity-10`} />
                  <div className="relative z-10">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <div className="text-sm font-bold mb-1">{badge.name}</div>
                    <div className="text-[10px] text-white/40">{badge.description}</div>
                    <div className={`text-[9px] mt-2 px-2 py-0.5 rounded-full inline-block bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white font-bold`}>
                      {tRarity(badge.rarity)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Locked badges */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-white/40">🔒 {t('locked')} ({lockedBadges.length})</h2>
          <div className="grid grid-cols-3 gap-3">
            {lockedBadges.map((badge, i) => (
              <motion.div
                key={badge.id}
                className="glass rounded-2xl p-4 text-center opacity-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="text-4xl mb-2 grayscale">🔒</div>
                <div className="text-sm font-bold mb-1">???</div>
                <div className="text-[10px] text-white/40">{badge.description}</div>
                <div className={`text-[9px] mt-2 px-2 py-0.5 rounded-full inline-block bg-white/10 font-bold`}>
                  {tRarity(badge.rarity)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
