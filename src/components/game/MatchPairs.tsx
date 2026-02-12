'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/types';

interface MatchPairsProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export function MatchPairs({ question, onAnswer, disabled }: MatchPairsProps) {
  // For now, match-pairs falls back to multiple choice style
  const pairs = question.pairs || [];
  const [matchedCount, setMatchedCount] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<number | null>(null);

  const handleLeftClick = (index: number) => {
    if (disabled || matched.has(index)) return;
    setSelectedLeft(index);
    setWrongPair(null);
  };

  const handleRightClick = (rightIndex: number) => {
    if (disabled || selectedLeft === null) return;
    if (rightIndex === selectedLeft) {
      // Correct match
      const newMatched = new Set(matched);
      newMatched.add(selectedLeft);
      setMatched(newMatched);
      setSelectedLeft(null);
      setMatchedCount(matchedCount + 1);
      if (newMatched.size === pairs.length) {
        setTimeout(() => onAnswer(true), 500);
      }
    } else {
      // Wrong match
      setWrongPair(rightIndex);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
      }, 500);
    }
  };

  if (pairs.length === 0) {
    return <div className="text-white/50">No pairs available</div>;
  }

  // Shuffle right side
  const rightSide = pairs.map((p, i) => ({ text: p.right, originalIndex: i }));

  return (
    <div className="flex gap-6 w-full max-w-lg justify-center">
      {/* Left column */}
      <div className="flex flex-col gap-2">
        {pairs.map((pair, i) => (
          <motion.button
            key={`left-${i}`}
            onClick={() => handleLeftClick(i)}
            disabled={matched.has(i)}
            className={`px-4 py-3 rounded-xl font-semibold text-sm min-w-[120px] transition-all ${
              matched.has(i)
                ? 'bg-green-500/30 text-green-300 opacity-50'
                : selectedLeft === i
                ? 'bg-purple-500/40 ring-2 ring-purple-400'
                : 'glass hover:bg-white/15'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {pair.left}
          </motion.button>
        ))}
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-2">
        {rightSide.map((item, i) => (
          <motion.button
            key={`right-${i}`}
            onClick={() => handleRightClick(item.originalIndex)}
            disabled={matched.has(item.originalIndex)}
            className={`px-4 py-3 rounded-xl font-semibold text-sm min-w-[120px] transition-all ${
              matched.has(item.originalIndex)
                ? 'bg-green-500/30 text-green-300 opacity-50'
                : wrongPair === item.originalIndex
                ? 'bg-red-500/30 ring-2 ring-red-400 animate-shake'
                : 'glass hover:bg-white/15'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {item.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
