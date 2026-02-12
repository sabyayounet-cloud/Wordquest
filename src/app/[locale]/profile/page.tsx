'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useGame } from '@/providers/GameProvider';
import { useRouter } from '@/i18n/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { getLevelTitle } from '@/lib/gamification/xp';
import { getStreakEmoji } from '@/lib/gamification/streaks';
import { formatNumber } from '@/lib/utils';
import { Language } from '@/types';

const AVATARS: Record<string, string> = {
  dragon: '🐉', unicorn: '🦄', fox: '🦊', owl: '🦉', panda: '🐼', lion: '🦁',
  dolphin: '🐬', eagle: '🦅', wolf: '🐺', cat: '🐱', koala: '🐨', penguin: '🐧',
};

const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
];

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tLang = useTranslations('languages');
  const { state, setProfile, resetGame } = useGame();
  const router = useRouter();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  if (!state.profile) {
    router.push('/onboarding');
    return null;
  }

  const profile = state.profile;
  const avatarEmoji = AVATARS[profile.avatarId] || '🦸';
  const completedCount = Object.keys(state.completedLevels).length;
  const perfectCount = Object.values(state.completedLevels).filter(l => l.perfectRun).length;

  const stats = [
    { label: t('totalXP'), value: formatNumber(state.xp), icon: '⭐' },
    { label: t('level'), value: state.level, icon: '📊' },
    { label: t('streak'), value: `${state.streak} ${getStreakEmoji(state.streak)}`, icon: '🔥' },
    { label: t('coins'), value: formatNumber(state.coins), icon: '💰' },
    { label: t('levelsCompleted'), value: completedCount, icon: '📚' },
    { label: t('perfectScores'), value: perfectCount, icon: '💎' },
    { label: t('badges'), value: state.badges.length, icon: '🏆' },
  ];

  const handleAvatarChange = (avatarId: string) => {
    setProfile({ ...profile, avatarId });
    setShowAvatarPicker(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setProfile({ ...profile, learningLanguage: lang });
  };

  const handleReset = () => {
    resetGame();
    router.push('/');
  };

  return (
    <div className="min-h-screen pb-24 pt-16">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile header */}
        <motion.div
          className="glass rounded-2xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button onClick={() => setShowAvatarPicker(!showAvatarPicker)} className="relative group">
            <div className="text-7xl mb-2 group-hover:scale-110 transition-transform">{avatarEmoji}</div>
            <div className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">{t('changeAvatar')}</div>
          </button>
          <h1 className="text-2xl font-black">{profile.name}</h1>
          <p className="text-purple-300 font-semibold">
            Level {state.level} - {getLevelTitle(state.level)}
          </p>
          <p className="text-xs text-white/30 mt-1">
            {t('memberSince', { date: new Date(profile.createdAt).toLocaleDateString() })}
          </p>
        </motion.div>

        {/* Avatar picker */}
        {showAvatarPicker && (
          <motion.div
            className="glass rounded-2xl p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <h3 className="font-bold mb-3">{t('changeAvatar')}</h3>
            <div className="grid grid-cols-6 gap-2">
              {Object.entries(AVATARS).map(([id, emoji]) => (
                <button
                  key={id}
                  onClick={() => handleAvatarChange(id)}
                  className={`p-2 rounded-xl text-3xl transition-all ${
                    profile.avatarId === id ? 'bg-purple-500/50 ring-2 ring-purple-400' : 'hover:bg-white/10'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold mb-3">{t('stats')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass rounded-xl p-4 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Language */}
        <motion.div
          className="glass rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-bold mb-3">{t('learningLanguage')}</h3>
          <div className="flex gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex-1 p-3 rounded-xl text-center transition-all ${
                  profile.learningLanguage === lang.code
                    ? 'bg-purple-500/50 ring-2 ring-purple-400'
                    : 'glass hover:bg-white/10'
                }`}
              >
                <div className="text-2xl">{lang.flag}</div>
                <div className="text-xs font-semibold mt-1">{tLang(lang.code)}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Reset */}
        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-sm text-red-400/50 hover:text-red-400 transition-colors"
            >
              {t('resetProgress')}
            </button>
          ) : (
            <div className="glass rounded-xl p-4">
              <p className="text-red-400 text-sm mb-3">{t('resetConfirm')}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-500/50 rounded-lg text-sm font-bold hover:bg-red-500/70"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 glass rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
