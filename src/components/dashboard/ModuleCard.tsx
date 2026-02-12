'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ModuleSlug } from '@/types';
import { getModuleColor, getModuleIcon } from '@/lib/utils';

interface ModuleCardProps {
  slug: ModuleSlug;
  completedLevels: number;
  totalLevels: number;
  nextLevelId: string | null;
  delay?: number;
}

export function ModuleCard({ slug, completedLevels, totalLevels, nextLevelId, delay = 0 }: ModuleCardProps) {
  const t = useTranslations('modules');
  const progress = totalLevels > 0 ? completedLevels / totalLevels : 0;
  const isCompleted = completedLevels >= totalLevels && totalLevels > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link href={nextLevelId ? `/play/${slug}/${nextLevelId}` : `/play/${slug}/${slug}-1`}>
        <div className="game-card glass rounded-2xl p-5 cursor-pointer group relative overflow-hidden">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getModuleColor(slug)} opacity-10 group-hover:opacity-20 transition-opacity`} />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{getModuleIcon(slug)}</span>
              {isCompleted && <span className="text-lg">✅</span>}
            </div>

            <h3 className="text-lg font-bold mb-1">{t(slug)}</h3>
            <p className="text-xs text-white/50 mb-3">{t(`${slug}Desc`)}</p>

            {/* Progress bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getModuleColor(slug)} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ delay: delay + 0.3, duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-white/40">
                {completedLevels}/{totalLevels} levels
              </span>
              <span className="text-[10px] text-white/40">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
