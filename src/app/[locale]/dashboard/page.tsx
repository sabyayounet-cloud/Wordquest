'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useGame } from '@/providers/GameProvider';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { DailyChallenge } from '@/components/dashboard/DailyChallenge';
import { ModuleCard } from '@/components/dashboard/ModuleCard';
import { getAvailableModules, getLevelsByAgeGroup } from '@/lib/content/content-loader';
import { ModuleSlug } from '@/types';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { state, updateStreak } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!state.profile) {
      router.push('/onboarding');
      return;
    }
    updateStreak();
  }, [state.profile, router, updateStreak]);

  if (!state.profile) return null;

  const ageGroup = state.profile.ageGroup;
  const learningLang = state.profile.learningLanguage;
  const availableModules = getAvailableModules(ageGroup);

  function getModuleInfo(slug: ModuleSlug) {
    const levels = getLevelsByAgeGroup(learningLang, slug, ageGroup);
    const completedLevels = Object.values(state.completedLevels)
      .filter(l => l.moduleSlug === slug).length;
    const nextLevel = levels.find(l => !state.completedLevels[l.id]);
    return {
      completedLevels,
      totalLevels: levels.length,
      nextLevelId: nextLevel?.id || levels[0]?.id || null,
    };
  }

  return (
    <div className="min-h-screen pb-24 pt-16">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <StatsOverview />
        <StreakDisplay />
        <DailyChallenge />

        {/* Modules */}
        <div>
          <h2 className="text-xl font-bold mb-4">{t('modules')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {availableModules.map((slug, i) => {
              const info = getModuleInfo(slug);
              return (
                <ModuleCard
                  key={slug}
                  slug={slug}
                  completedLevels={info.completedLevels}
                  totalLevels={info.totalLevels}
                  nextLevelId={info.nextLevelId}
                  delay={i * 0.1}
                />
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
