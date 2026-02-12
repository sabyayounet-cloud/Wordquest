'use client';

import { motion, AnimatePresence } from 'framer-motion';

export function CoinShower({ active, amount }: { active: boolean; amount: number }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[9997] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: Math.min(amount, 20) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              initial={{
                y: 0,
                x: (Math.random() - 0.5) * 200,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                y: -200 - Math.random() * 100,
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0.5],
                rotate: 360,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                ease: 'easeOut',
              }}
            >
              🪙
            </motion.div>
          ))}
          <motion.div
            className="text-2xl font-black text-yellow-400"
            initial={{ scale: 0, y: 0 }}
            animate={{ scale: [0, 1.5, 1], y: -60 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            +{amount}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
