'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Question } from '@/types';

interface TypingInputProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export function TypingInput({ question, onAnswer, disabled }: TypingInputProps) {
  const t = useTranslations('game');
  const [value, setValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (disabled || showResult || !value.trim()) return;
    const correct = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.some(a => a.toLowerCase().trim() === value.toLowerCase().trim())
      : question.correctAnswer.toString().toLowerCase().trim() === value.toLowerCase().trim();

    setIsCorrect(correct);
    setShowResult(true);
    setTimeout(() => onAnswer(correct), 800);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={t('typeAnswer')}
          disabled={disabled || showResult}
          className={`w-full px-6 py-4 rounded-xl text-lg font-semibold text-center transition-all border-2 ${
            showResult
              ? isCorrect
                ? 'bg-green-500/20 border-green-400 text-green-300'
                : 'bg-red-500/20 border-red-400 text-red-300 animate-shake'
              : 'bg-white/10 border-white/20 text-white focus:border-purple-400 focus:outline-none'
          }`}
          autoFocus
        />
        {showResult && !isCorrect && (
          <motion.div
            className="mt-2 text-center text-green-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Correct answer: {Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : question.correctAnswer}
          </motion.div>
        )}
      </div>
      {!showResult && (
        <motion.button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold disabled:opacity-30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('checkAnswer')}
        </motion.button>
      )}
    </div>
  );
}
