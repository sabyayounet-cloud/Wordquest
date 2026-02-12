'use client';

import { motion } from 'framer-motion';

export function Hearts({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          className={`text-xl ${i < count ? '' : 'opacity-20 grayscale'}`}
          animate={i === count ? { scale: [1, 0.5, 0], opacity: [1, 0.5, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          ❤️
        </motion.span>
      ))}
    </div>
  );
}
