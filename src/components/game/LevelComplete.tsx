'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { LevelResult, ModuleSlug } from '@/types';
import { Confetti } from '@/components/effects/Confetti';
import { getBadgeById } from '@/lib/gamification/badges';

interface LevelCompleteProps {
  result: LevelResult;
}

export function LevelComplete({ result }: LevelCompleteProps) {
  const t = useTranslations('levelComplete');
  const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const isPerfect = result.perfectRun;

  const getMessage = () => {
    if (isPerfect) return t('perfect');
    if (accuracy >= 80) return t('great');
    if (accuracy >= 60) return t('good');
    return t('tryHarder');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <Confetti active={isPerfect} />

      <motion.div
        className="glass rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* Background glow */}
        <div className={`absolute inset-0 ${isPerfect ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10' : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'}`} />

        <div className="relative z-10">
          {/* Stars */}
          <div className="flex justify-center gap-3 mb-4">
            {[1, 2, 3].map((star) => (
              <motion.span
                key={star}
                className={`text-5xl ${star <= result.stars ? '' : 'opacity-20 grayscale'}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: star * 0.2, type: 'spring', stiffness: 300 }}
              >
                ⭐
              </motion.span>
            ))}
          </div>

          {/* Title */}
          <motion.h1
            className="text-3xl font-black mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {t('title')}
          </motion.h1>

          <motion.p
            className={`text-xl font-bold mb-6 ${isPerfect ? 'text-yellow-400' : accuracy >= 80 ? 'text-green-400' : 'text-purple-300'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {getMessage()}
          </motion.p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              className="glass rounded-xl p-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-yellow-400 font-bold text-lg">{t('xpEarned', { amount: result.xpEarned })}</div>
            </motion.div>
            <motion.div
              className="glass rounded-xl p-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="text-2xl mb-1">💰</div>
              <div className="text-yellow-300 font-bold text-lg">{t('coinsEarned', { amount: result.coinsEarned })}</div>
            </motion.div>
            <motion.div
              className="glass rounded-xl p-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-green-400 font-bold text-lg">{t('accuracy', { percent: accuracy })}</div>
            </motion.div>
          </div>

          {/* Level up message */}
          {result.leveledUp && result.newLevel && (
            <motion.div
              className="mb-4 p-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, type: 'spring' }}
            >
              <div className="text-2xl">🎉</div>
              <div className="font-bold text-purple-300">{t('levelUp', { level: result.newLevel })}</div>
            </motion.div>
          )}

          {/* New badges */}
          {result.newBadges.length > 0 && (
            <motion.div
              className="mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6, type: 'spring' }}
            >
              <div className="text-sm text-yellow-400 font-bold mb-2">{t('newBadge')}</div>
              <div className="flex justify-center gap-2">
                {result.newBadges.map((badgeId) => {
                  const badge = getBadgeById(badgeId);
                  return badge ? (
                    <div key={badgeId} className="glass rounded-xl p-2 text-center">
                      <div className="text-3xl">{badge.icon}</div>
                      <div className="text-xs font-semibold">{badge.name}</div>
                    </div>
                  ) : null;
                })}
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <Link href="/dashboard">
              <motion.button
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {t('backToModules')}
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
