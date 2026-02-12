'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/types';

interface MultipleChoiceProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export function MultipleChoice({ question, onAnswer, disabled }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: string) => {
    if (disabled || showResult) return;
    setSelected(option);
    setShowResult(true);

    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.includes(option)
      : option === question.correctAnswer;

    setTimeout(() => onAnswer(isCorrect), 800);
  };

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return selected === option ? 'ring-2 ring-purple-400 bg-purple-500/20' : 'glass hover:bg-white/15';
    }
    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.includes(option)
      : option === question.correctAnswer;

    if (isCorrect) return 'bg-green-500/30 ring-2 ring-green-400';
    if (option === selected && !isCorrect) return 'bg-red-500/30 ring-2 ring-red-400 animate-shake';
    return 'glass opacity-50';
  };

  return (
    <div className="grid grid-cols-1 gap-3 w-full max-w-lg">
      {(question.options || []).map((option, i) => (
        <motion.button
          key={`${option}-${i}`}
          onClick={() => handleSelect(option)}
          disabled={disabled || showResult}
          className={`p-4 rounded-xl text-left font-semibold transition-all ${getOptionStyle(option)}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={!showResult ? { scale: 1.02 } : {}}
          whileTap={!showResult ? { scale: 0.98 } : {}}
        >
          <span className="mr-3 text-purple-300/60">{String.fromCharCode(65 + i)}.</span>
          {option}
        </motion.button>
      ))}
    </div>
  );
}
