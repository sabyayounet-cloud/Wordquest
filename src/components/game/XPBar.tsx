'use client';

import { motion, AnimatePresence } from 'framer-motion';

export function XPBar({ xpGained, show }: { xpGained: number; show: boolean }) {
  return (
    <AnimatePresence>
      {show && xpGained > 0 && (
        <motion.div
          className="text-yellow-400 font-bold text-lg"
          initial={{ opacity: 0, y: 10, scale: 0.5 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
        >
          +{xpGained} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
