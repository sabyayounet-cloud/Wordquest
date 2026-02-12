'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/providers/GameProvider';
import { getStreakEmoji, getStreakMessage } from '@/lib/gamification/streaks';

export function StreakDisplay() {
  const { state } = useGame();
  const streakMsg = getStreakMessage(state.streak);

  if (state.streak < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="glass rounded-2xl p-4 border border-orange-500/30 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {getStreakEmoji(state.streak)}
            </motion.span>
            <div>
              <div className="font-bold text-orange-400">{streakMsg}</div>
              <div className="text-sm text-white/50">{state.streak} days in a row</div>
            </div>
          </div>
          <div className="text-3xl font-black text-orange-400">{state.streak}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
