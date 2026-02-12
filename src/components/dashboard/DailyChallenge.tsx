'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useGame } from '@/providers/GameProvider';
import { getDailyChallengeModule, getTodayDateString, isDailyChallengeCompleted } from '@/lib/gamification/daily-challenge';
import { getModuleIcon } from '@/lib/utils';

export function DailyChallenge() {
  const t = useTranslations('dashboard');
  const { state } = useGame();
  const today = getTodayDateString();
  const completed = isDailyChallengeCompleted(state.dailyChallengeCompleted);
  const moduleSlug = getDailyChallengeModule(today);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {completed ? (
        <div className="glass rounded-2xl p-5 border border-green-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <div className="relative z-10 flex items-center gap-4">
            <span className="text-4xl">✅</span>
            <div>
              <h3 className="font-bold text-green-400">{t('dailyCompleted')}</h3>
              <p className="text-sm text-white/50">Come back tomorrow for a new challenge!</p>
            </div>
          </div>
        </div>
      ) : (
        <Link href={`/play/${moduleSlug}/${moduleSlug}-1`}>
          <div className="game-card glass rounded-2xl p-5 border border-yellow-500/30 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.span
                  className="text-4xl"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡
                </motion.span>
                <div>
                  <h3 className="font-bold text-yellow-400">{t('dailyChallenge')}</h3>
                  <p className="text-sm text-white/50">{t('dailyChallengeDesc')}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">{getModuleIcon(moduleSlug)}</span>
                    <span className="text-xs text-yellow-300/70 capitalize">{moduleSlug}</span>
                  </div>
                </div>
              </div>
              <div className="text-3xl">→</div>
            </div>
          </div>
        </Link>
      )}
    </motion.div>
  );
}
