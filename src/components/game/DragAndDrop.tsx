'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Question } from '@/types';
import { shuffleArray } from '@/lib/utils';

interface DragAndDropProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export function DragAndDrop({ question, onAnswer, disabled }: DragAndDropProps) {
  const t = useTranslations('game');
  const [availableWords, setAvailableWords] = useState<string[]>(
    () => shuffleArray(question.words || [])
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAddWord = (word: string, index: number) => {
    if (disabled || showResult) return;
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (disabled || showResult) return;
    setAvailableWords([...availableWords, word]);
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    if (disabled || showResult) return;
    const correct = Array.isArray(question.correctAnswer)
      ? JSON.stringify(selectedWords) === JSON.stringify(question.correctAnswer)
      : selectedWords.join(' ') === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    setTimeout(() => onAnswer(correct), 1000);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      {/* Selected words area (the sentence being built) */}
      <div className={`w-full min-h-[60px] p-3 rounded-xl border-2 border-dashed flex flex-wrap gap-2 items-center justify-center ${
        showResult
          ? isCorrect ? 'border-green-400 bg-green-500/10' : 'border-red-400 bg-red-500/10'
          : 'border-white/30 bg-white/5'
      }`}>
        {selectedWords.length === 0 ? (
          <span className="text-white/30 text-sm">{t('arrangeWords')}</span>
        ) : (
          selectedWords.map((word, i) => (
            <motion.button
              key={`sel-${i}`}
              onClick={() => handleRemoveWord(word, i)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                showResult
                  ? isCorrect ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                  : 'bg-purple-500/40 text-purple-200 hover:bg-purple-500/60'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {word}
            </motion.button>
          ))
        )}
      </div>

      {/* Show correct answer if wrong */}
      {showResult && !isCorrect && Array.isArray(question.correctAnswer) && (
        <motion.div
          className="text-center text-green-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Correct: {question.correctAnswer.join(' ')}
        </motion.div>
      )}

      {/* Available words */}
      <div className="flex flex-wrap gap-2 justify-center">
        {availableWords.map((word, i) => (
          <motion.button
            key={`avail-${i}`}
            onClick={() => handleAddWord(word, i)}
            disabled={disabled || showResult}
            className="px-4 py-2 glass rounded-lg font-semibold text-sm hover:bg-white/15 transition-all"
            layout
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* Check button */}
      {!showResult && selectedWords.length > 0 && (
        <motion.button
          onClick={handleCheck}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {t('checkAnswer')}
        </motion.button>
      )}
    </div>
  );
}
