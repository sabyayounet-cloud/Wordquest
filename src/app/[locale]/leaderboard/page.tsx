'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useGame } from '@/providers/GameProvider';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { formatNumber } from '@/lib/utils';

interface LeaderboardEntry {
  name: string;
  avatarId: string;
  xp: number;
  level: number;
  isYou: boolean;
}

const AVATARS: Record<string, string> = {
  dragon: '🐉', unicorn: '🦄', fox: '🦊', owl: '🦉', panda: '🐼', lion: '🦁',
  dolphin: '🐬', eagle: '🦅', wolf: '🐺', cat: '🐱', koala: '🐨', penguin: '🐧',
  robot: '🤖', alien: '👽', wizard: '🧙', ninja: '🥷',
};

// Simulated leaderboard with bot players + real player
const BOT_PLAYERS = [
  { name: 'Luna', avatarId: 'unicorn', baseXP: 8500, level: 25 },
  { name: 'Max', avatarId: 'dragon', baseXP: 7200, level: 22 },
  { name: 'Sophie', avatarId: 'fox', baseXP: 6100, level: 19 },
  { name: 'Leo', avatarId: 'lion', baseXP: 5300, level: 17 },
  { name: 'Emma', avatarId: 'dolphin', baseXP: 4500, level: 15 },
  { name: 'Finn', avatarId: 'wolf', baseXP: 3200, level: 12 },
  { name: 'Mia', avatarId: 'owl', baseXP: 2100, level: 9 },
  { name: 'Noah', avatarId: 'penguin', baseXP: 1500, level: 7 },
  { name: 'Lily', avatarId: 'cat', baseXP: 800, level: 4 },
  { name: 'Tom', avatarId: 'koala', baseXP: 300, level: 2 },
];

export default function LeaderboardPage() {
  const t = useTranslations('leaderboard');
  const { state } = useGame();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const playerEntry: LeaderboardEntry = {
      name: state.profile?.name || 'You',
      avatarId: state.profile?.avatarId || 'fox',
      xp: state.xp,
      level: state.level,
      isYou: true,
    };

    const botEntries: LeaderboardEntry[] = BOT_PLAYERS.map(bot => ({
      ...bot,
      xp: bot.baseXP + Math.floor(Math.random() * 200),
      isYou: false,
    }));

    const all = [...botEntries, playerEntry].sort((a, b) => b.xp - a.xp);
    setEntries(all);
  }, [state.xp, state.level, state.profile]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen pb-24 pt-16">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.h1
          className="text-3xl font-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('title')} 🏆
        </motion.h1>

        {/* Top 3 podium */}
        {entries.length >= 3 && (
          <motion.div
            className="flex justify-center items-end gap-3 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* 2nd place */}
            <div className="text-center">
              <div className="text-4xl mb-1">{AVATARS[entries[1].avatarId] || '🦸'}</div>
              <div className="text-sm font-bold">{entries[1].name}</div>
              <div className="text-xs text-white/40">{formatNumber(entries[1].xp)} XP</div>
              <div className="w-20 h-16 bg-gradient-to-t from-gray-400/20 to-gray-300/10 rounded-t-lg mt-2 flex items-center justify-center text-2xl">
                🥈
              </div>
            </div>
            {/* 1st place */}
            <div className="text-center">
              <div className="text-5xl mb-1">{AVATARS[entries[0].avatarId] || '🦸'}</div>
              <div className="text-sm font-bold text-yellow-400">{entries[0].name}</div>
              <div className="text-xs text-yellow-300/60">{formatNumber(entries[0].xp)} XP</div>
              <div className="w-20 h-24 bg-gradient-to-t from-yellow-500/20 to-yellow-400/10 rounded-t-lg mt-2 flex items-center justify-center text-3xl">
                🥇
              </div>
            </div>
            {/* 3rd place */}
            <div className="text-center">
              <div className="text-4xl mb-1">{AVATARS[entries[2].avatarId] || '🦸'}</div>
              <div className="text-sm font-bold">{entries[2].name}</div>
              <div className="text-xs text-white/40">{formatNumber(entries[2].xp)} XP</div>
              <div className="w-20 h-12 bg-gradient-to-t from-orange-400/20 to-orange-300/10 rounded-t-lg mt-2 flex items-center justify-center text-2xl">
                🥉
              </div>
            </div>
          </motion.div>
        )}

        {/* Full list */}
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <motion.div
              key={`${entry.name}-${i}`}
              className={`glass rounded-xl p-3 flex items-center gap-3 ${
                entry.isYou ? 'ring-2 ring-purple-400 bg-purple-500/10' : ''
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <div className="w-8 text-center font-bold text-sm">
                {i < 3 ? getRankIcon(i + 1) : <span className="text-white/40">{i + 1}</span>}
              </div>
              <div className="text-2xl">{AVATARS[entry.avatarId] || '🦸'}</div>
              <div className="flex-1">
                <div className="font-bold text-sm">
                  {entry.name} {entry.isYou && <span className="text-purple-300 text-xs">{t('you')}</span>}
                </div>
                <div className="text-xs text-white/40">Level {entry.level}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-yellow-400 text-sm">{formatNumber(entry.xp)}</div>
                <div className="text-[10px] text-white/30">XP</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
