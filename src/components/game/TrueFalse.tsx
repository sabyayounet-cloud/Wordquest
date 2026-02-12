'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Question } from '@/types';

interface TrueFalseProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export function TrueFalse({ question, onAnswer, disabled }: TrueFalseProps) {
  const t = useTranslations('game.trueFalse');
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (value: string) => {
    if (disabled || showResult) return;
    setSelected(value);
    setShowResult(true);
    const isCorrect = value === question.correctAnswer;
    setTimeout(() => onAnswer(isCorrect), 800);
  };

  const getStyle = (value: string) => {
    if (!showResult) return 'glass hover:bg-white/15';
    const isCorrect = value === question.correctAnswer;
    if (isCorrect) return 'bg-green-500/30 ring-2 ring-green-400';
    if (value === selected && !isCorrect) return 'bg-red-500/30 ring-2 ring-red-400 animate-shake';
    return 'glass opacity-50';
  };

  return (
    <div className="flex gap-4 w-full max-w-lg justify-center">
      <motion.button
        onClick={() => handleSelect('true')}
        disabled={disabled || showResult}
        className={`flex-1 p-6 rounded-2xl font-bold text-xl text-center transition-all ${getStyle('true')}`}
        whileHover={!showResult ? { scale: 1.03 } : {}}
        whileTap={!showResult ? { scale: 0.97 } : {}}
      >
        <div className="text-4xl mb-2">✅</div>
        {t('true')}
      </motion.button>

      <motion.button
        onClick={() => handleSelect('false')}
        disabled={disabled || showResult}
        className={`flex-1 p-6 rounded-2xl font-bold text-xl text-center transition-all ${getStyle('false')}`}
        whileHover={!showResult ? { scale: 1.03 } : {}}
        whileTap={!showResult ? { scale: 0.97 } : {}}
      >
        <div className="text-4xl mb-2">❌</div>
        {t('false')}
      </motion.button>
    </div>
  );
}
