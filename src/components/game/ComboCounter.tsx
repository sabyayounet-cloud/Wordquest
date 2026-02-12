'use client';

import { motion, AnimatePresence } from 'framer-motion';

export function ComboCounter({ combo }: { combo: number }) {
  if (combo < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={combo}
        className="flex items-center gap-2"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <span className="text-orange-400 font-black text-xl">
          🔥 x{combo}
        </span>
        {combo >= 5 && (
          <motion.span
            className="text-xs bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 rounded-full font-bold"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            FIRE!
          </motion.span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
