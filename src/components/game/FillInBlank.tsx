'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/types';

interface FillInBlankProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export function FillInBlank({ question, onAnswer, disabled }: FillInBlankProps) {
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
      return 'glass hover:bg-white/15';
    }
    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.includes(option)
      : option === question.correctAnswer;
    if (isCorrect) return 'bg-green-500/30 ring-2 ring-green-400';
    if (option === selected && !isCorrect) return 'bg-red-500/30 ring-2 ring-red-400 animate-shake';
    return 'glass opacity-50';
  };

  // Build sentence display with blank
  const sentenceParts = question.sentence
    ? question.sentence.split('___')
    : [question.prompt];

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      {/* Sentence with blank */}
      <div className="text-xl font-semibold text-center leading-relaxed">
        {sentenceParts.map((part, i) => (
          <span key={i}>
            {part}
            {i < sentenceParts.length - 1 && (
              <span className={`inline-block mx-1 px-4 py-1 rounded-lg min-w-[80px] text-center border-b-2 ${
                selected
                  ? showResult
                    ? (Array.isArray(question.correctAnswer)
                        ? question.correctAnswer.includes(selected)
                        : selected === question.correctAnswer)
                      ? 'border-green-400 text-green-400 bg-green-500/20'
                      : 'border-red-400 text-red-400 bg-red-500/20'
                    : 'border-purple-400 text-purple-300 bg-purple-500/20'
                  : 'border-white/30 text-white/30'
              }`}>
                {selected || '______'}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {(question.options || []).map((option, i) => (
          <motion.button
            key={`${option}-${i}`}
            onClick={() => handleSelect(option)}
            disabled={disabled || showResult}
            className={`p-3 rounded-xl font-semibold text-center transition-all ${getOptionStyle(option)}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={!showResult ? { scale: 1.03 } : {}}
            whileTap={!showResult ? { scale: 0.97 } : {}}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
