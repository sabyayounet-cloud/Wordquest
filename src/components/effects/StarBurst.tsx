'use client';

import { motion, AnimatePresence } from 'framer-motion';

export function StarBurst({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[9998] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.5],
                opacity: [1, 0],
                x: Math.cos((i * Math.PI * 2) / 8) * 100,
                y: Math.sin((i * Math.PI * 2) / 8) * 100,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              ⭐
            </motion.div>
          ))}
          <motion.div
            className="text-6xl"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 1], rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            ✨
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
