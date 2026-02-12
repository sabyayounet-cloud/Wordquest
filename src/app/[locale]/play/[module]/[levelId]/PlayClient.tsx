'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useGame } from '@/providers/GameProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, LevelResult, ModuleSlug, CompletedLevel } from '@/types';
import { getLevelById, getShuffledQuestions } from '@/lib/content/content-loader';
import { calculateQuestionXP, calculateLevelCompleteXP, calculateCoins, calculateStars, getStreakMultiplier, getLevelFromXP } from '@/lib/gamification/xp';
import { QuestionCard } from '@/components/game/QuestionCard';
import { Hearts } from '@/components/game/Hearts';
import { ComboCounter } from '@/components/game/ComboCounter';
import { XPBar } from '@/components/game/XPBar';
import { LevelComplete } from '@/components/game/LevelComplete';
import { StarBurst } from '@/components/effects/StarBurst';

interface PlayClientProps {
  params: Promise<{ module: string; levelId: string }>;
}

export default function PlayClient({ params }: PlayClientProps) {
  const { module: moduleSlug, levelId } = use(params);
  const t = useTranslations('game');
  const router = useRouter();
  const {
    state,
    addXP,
    addCoins,
    loseHeart,
    resetHearts,
    completeLevel,
    setCombo,
    checkAndAwardBadges,
  } = useGame();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [combo, setComboLocal] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const [showStar, setShowStar] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<LevelResult | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isAnswering, setIsAnswering] = useState(false);

  // Load level
  useEffect(() => {
    if (!state.profile) {
      router.push('/onboarding');
      return;
    }
    const level = getLevelById(state.profile.learningLanguage, moduleSlug as ModuleSlug, levelId);
    if (level) {
      setQuestions(getShuffledQuestions(level));
      resetHearts();
      setHearts(5);
    }
  }, [state.profile, moduleSlug, levelId, router, resetHearts]);

  const handleAnswer = useCallback((correct: boolean) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const timeTaken = (Date.now() - questionStartTime) / 1000;
    const streakMultiplier = getStreakMultiplier(state.streak);

    if (correct) {
      const newCombo = combo + 1;
      setComboLocal(newCombo);
      setCombo(newCombo);
      setCorrectCount(prev => prev + 1);

      const xpGained = calculateQuestionXP(true, newCombo, timeTaken, streakMultiplier);
      setTotalXP(prev => prev + xpGained);
      setLastXP(xpGained);
      setShowXP(true);
      setShowStar(true);

      setTimeout(() => {
        setShowXP(false);
        setShowStar(false);
      }, 600);
    } else {
      setComboLocal(0);
      setCombo(0);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      loseHeart();

      if (newHearts <= 0) {
        setGameOver(true);
        return;
      }
    }

    // Move to next question or complete
    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        handleLevelComplete(correct ? correctCount + 1 : correctCount);
      } else {
        setCurrentIndex(prev => prev + 1);
        setQuestionStartTime(Date.now());
        setIsAnswering(false);
      }
    }, 1000);
  }, [isAnswering, questionStartTime, state.streak, combo, hearts, currentIndex, questions.length, correctCount, loseHeart, setCombo]);

  const handleLevelComplete = useCallback((finalCorrect: number) => {
    const totalQ = questions.length;
    const isPerfect = finalCorrect === totalQ;
    const completionXP = calculateLevelCompleteXP(finalCorrect, totalQ, isPerfect);
    const totalEarned = totalXP + completionXP;
    const coinsEarned = calculateCoins(finalCorrect, totalQ, isPerfect);
    const stars = calculateStars(finalCorrect, totalQ);

    // Apply rewards
    addXP(totalEarned);
    addCoins(coinsEarned);

    const completedLevelData: CompletedLevel = {
      moduleSlug: moduleSlug as ModuleSlug,
      levelId,
      stars,
      bestScore: finalCorrect,
      completedAt: new Date().toISOString(),
      perfectRun: isPerfect,
    };
    completeLevel(completedLevelData);

    const prevLevel = state.level;
    const newLevel = getLevelFromXP(state.xp + totalEarned);
    const newBadges = checkAndAwardBadges();

    const levelResult: LevelResult = {
      levelId,
      moduleSlug: moduleSlug as ModuleSlug,
      correctAnswers: finalCorrect,
      totalQuestions: totalQ,
      xpEarned: totalEarned,
      coinsEarned,
      timeSpent: 0,
      perfectRun: isPerfect,
      newBadges,
      leveledUp: newLevel > prevLevel,
      newLevel: newLevel > prevLevel ? newLevel : undefined,
      stars,
    };

    setResult(levelResult);
  }, [questions.length, totalXP, addXP, addCoins, completeLevel, checkAndAwardBadges, moduleSlug, levelId, state.level, state.xp]);

  // If no questions loaded yet
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-float mb-4">📚</div>
          <div className="text-white/50">{t('selectAnswer')}...</div>
        </div>
      </div>
    );
  }

  // Level complete screen
  if (result) {
    return <LevelComplete result={result} />;
  }

  // Game over (no hearts)
  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          className="glass rounded-3xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold mb-2">{t('noHearts')}</h2>
          <p className="text-white/60 mb-6">{t('noHeartsDesc')}</p>
          <div className="flex flex-col gap-3">
            <motion.button
              onClick={() => {
                setGameOver(false);
                setCurrentIndex(0);
                setHearts(5);
                setComboLocal(0);
                setCorrectCount(0);
                setTotalXP(0);
                setIsAnswering(false);
                setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              🔄 {t('selectAnswer')}
            </motion.button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 glass rounded-xl font-semibold text-white/60"
            >
              ← Back
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  return (
    <div className="min-h-screen flex flex-col p-4 relative">
      <StarBurst active={showStar} />

      {/* Header */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-white/40 hover:text-white text-sm"
          >
            ✕
          </button>
          <Hearts count={hearts} />
          <ComboCounter combo={combo} />
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/40">
            {t('question', { current: currentIndex + 1, total: questions.length })}
          </span>
          <div className="relative">
            <XPBar xpGained={lastXP} show={showXP} />
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="w-full flex flex-col items-center gap-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Prompt */}
            <div className="text-center">
              <motion.h2
                className="text-2xl font-bold leading-relaxed"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
              >
                {currentQuestion.prompt}
              </motion.h2>
              {currentQuestion.hint && (
                <p className="text-sm text-white/40 mt-2">💡 {currentQuestion.hint}</p>
              )}
            </div>

            {/* Question Component */}
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              disabled={isAnswering}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
