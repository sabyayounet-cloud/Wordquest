'use client';

import { useTranslations } from 'next-intl';
import { useGame } from '@/providers/GameProvider';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export default function LandingPage() {
  const t = useTranslations();
  const { state } = useGame();
  const hasProfile = !!state.profile;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...'🔤📖✏️💬📝📚✍️⭐🏆🔥💎💰'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-20"
            style={{ left: `${(i * 8) % 100}%`, top: `${(i * 13) % 100}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <motion.div
        className="text-center z-10 max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <motion.div
          className="text-8xl mb-4"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🏰
        </motion.div>

        <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4">
          {t('landing.title')}
        </h1>

        <p className="text-xl text-purple-200 mb-2 font-semibold">
          {t('landing.subtitle')}
        </p>
        <p className="text-sm text-purple-300/70 mb-10">
          {t('landing.tagline')}
        </p>

        {/* CTA Button */}
        <Link href={hasProfile ? '/dashboard' : '/onboarding'}>
          <motion.button
            className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-2xl font-bold shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {hasProfile ? t('landing.continueButton') : t('landing.startButton')}
          </motion.button>
        </Link>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {['🔤 Phonics', '📖 Vocabulary', '✏️ Spelling', '💬 Sentences', '📝 Grammar', '📚 Reading', '✍️ Writing'].map((item, i) => (
            <motion.span
              key={i}
              className="px-4 py-2 glass rounded-full text-sm font-semibold text-purple-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {item}
            </motion.span>
          ))}
        </div>

        {/* Language badges */}
        <div className="flex justify-center gap-4 mt-6">
          {['🇬🇧 English', '🇩🇪 Deutsch', '🇳🇱 Nederlands'].map((lang, i) => (
            <motion.span
              key={i}
              className="px-3 py-1 bg-white/10 rounded-lg text-sm text-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.15 }}
            >
              {lang}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
