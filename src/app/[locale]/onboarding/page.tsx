'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useGame } from '@/providers/GameProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { AgeGroup, Language, UserProfile } from '@/types';
import { generateId } from '@/lib/utils';

const AVATARS = [
  { id: 'dragon', emoji: '🐉', name: 'Dragon' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
  { id: 'fox', emoji: '🦊', name: 'Fox' },
  { id: 'owl', emoji: '🦉', name: 'Owl' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'lion', emoji: '🦁', name: 'Lion' },
  { id: 'dolphin', emoji: '🐬', name: 'Dolphin' },
  { id: 'eagle', emoji: '🦅', name: 'Eagle' },
  { id: 'wolf', emoji: '🐺', name: 'Wolf' },
  { id: 'cat', emoji: '🐱', name: 'Cat' },
  { id: 'koala', emoji: '🐨', name: 'Koala' },
  { id: 'penguin', emoji: '🐧', name: 'Penguin' },
];

const AGE_GROUPS: AgeGroup[] = ['4-6', '7-9', '10-12', '13-15'];

const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
];

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const tLang = useTranslations('languages');
  const { setProfile, updateStreak } = useGame();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [learningLanguage, setLearningLanguage] = useState<Language>('en');

  const steps = [
    // Step 0: Name
    <motion.div key="name" className="flex flex-col items-center gap-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <div className="text-6xl animate-float">✨</div>
      <h2 className="text-3xl font-bold text-center">{t('whatName')}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('namePlaceholder')}
        className="w-full max-w-sm px-6 py-4 bg-white/10 rounded-2xl text-white text-xl text-center font-bold placeholder-white/30 border-2 border-white/20 focus:border-purple-400 focus:outline-none transition-all"
        maxLength={20}
        autoFocus
      />
      <motion.button
        onClick={() => name.trim() && setStep(1)}
        disabled={!name.trim()}
        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('letsGo')} →
      </motion.button>
    </motion.div>,

    // Step 1: Age
    <motion.div key="age" className="flex flex-col items-center gap-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <div className="text-6xl animate-float">🎂</div>
      <h2 className="text-3xl font-bold text-center">{t('howOld')}</h2>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {AGE_GROUPS.map((ag) => (
          <motion.button
            key={ag}
            onClick={() => { setAgeGroup(ag); setStep(2); }}
            className={`p-4 rounded-2xl text-center font-bold transition-all ${
              ageGroup === ag
                ? 'bg-purple-500 shadow-lg shadow-purple-500/30'
                : 'glass hover:bg-white/15'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="text-2xl mb-1">
              {ag === '4-6' ? '🧒' : ag === '7-9' ? '👦' : ag === '10-12' ? '🧑' : '🧑‍🎓'}
            </div>
            <div className="text-sm">{t(`ageGroups.${ag}`)}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>,

    // Step 2: Avatar
    <motion.div key="avatar" className="flex flex-col items-center gap-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <div className="text-6xl animate-float">🦸</div>
      <h2 className="text-3xl font-bold text-center">{t('pickAvatar')}</h2>
      <div className="grid grid-cols-4 gap-3 max-w-md">
        {AVATARS.map((avatar) => (
          <motion.button
            key={avatar.id}
            onClick={() => setAvatarId(avatar.id)}
            className={`p-3 rounded-2xl text-center transition-all ${
              avatarId === avatar.id
                ? 'bg-purple-500 shadow-lg shadow-purple-500/30 ring-2 ring-purple-300'
                : 'glass hover:bg-white/15'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="text-4xl">{avatar.emoji}</div>
            <div className="text-[10px] mt-1 font-semibold">{avatar.name}</div>
          </motion.button>
        ))}
      </div>
      <motion.button
        onClick={() => avatarId && setStep(3)}
        disabled={!avatarId}
        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-lg font-bold disabled:opacity-30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('letsGo')} →
      </motion.button>
    </motion.div>,

    // Step 3: Learning Language
    <motion.div key="language" className="flex flex-col items-center gap-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <div className="text-6xl animate-float">🌍</div>
      <h2 className="text-3xl font-bold text-center">{t('learningLanguage')}</h2>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {LANGUAGES.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => setLearningLanguage(lang.code)}
            className={`p-5 rounded-2xl flex items-center gap-4 text-left transition-all ${
              learningLanguage === lang.code
                ? 'bg-purple-500 shadow-lg shadow-purple-500/30'
                : 'glass hover:bg-white/15'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-4xl">{lang.flag}</span>
            <div>
              <div className="font-bold text-lg">{lang.label}</div>
              <div className="text-sm text-white/60">{tLang(lang.code)}</div>
            </div>
          </motion.button>
        ))}
      </div>
      <motion.button
        onClick={handleComplete}
        className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-xl font-bold shadow-lg shadow-green-500/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('letsGo')} 🚀
      </motion.button>
    </motion.div>,
  ];

  function handleComplete() {
    if (!name.trim() || !ageGroup || !avatarId) return;

    const profile: UserProfile = {
      id: generateId(),
      name: name.trim(),
      ageGroup,
      avatarId,
      uiLanguage: 'en',
      learningLanguage,
      createdAt: new Date().toISOString(),
    };

    setProfile(profile);
    updateStreak();
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Progress dots */}
      <div className="flex gap-2 mb-10">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i <= step ? 'bg-purple-400 scale-110' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Back button */}
      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors text-lg"
        >
          ← Back
        </button>
      )}

      <AnimatePresence mode="wait">
        {steps[step]}
      </AnimatePresence>
    </div>
  );
}
