'use client';

import { useTranslations } from 'next-intl';
import { useGame } from '@/providers/GameProvider';
import { Link } from '@/i18n/navigation';
import { getXPProgress } from '@/lib/gamification/xp';
import { getStreakEmoji } from '@/lib/gamification/streaks';
import { formatNumber } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const t = useTranslations();
  const { state } = useGame();
  const xpProgress = getXPProgress(state.xp, state.level);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          WordQuest
        </Link>

        <div className="flex items-center gap-4">
          {/* XP Bar */}
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-sm font-bold">Lv.{state.level}</span>
            <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress * 100}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          {state.streak > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span>{getStreakEmoji(state.streak)}</span>
              <span className="font-bold text-orange-400">{state.streak}</span>
            </div>
          )}

          {/* Coins */}
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">💰</span>
            <span className="text-sm font-bold text-yellow-300">{formatNumber(state.coins)}</span>
          </div>

          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
