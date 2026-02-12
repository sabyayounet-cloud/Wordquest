'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: '🏠', key: 'home' },
  { href: '/achievements', icon: '🏆', key: 'achievements' },
  { href: '/shop', icon: '🛒', key: 'shop' },
  { href: '/leaderboard', icon: '📊', key: 'leaderboard' },
  { href: '/profile', icon: '👤', key: 'profile' },
] as const;

export function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all',
                isActive
                  ? 'text-purple-300 scale-110'
                  : 'text-white/40 hover:text-white/70'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-semibold">{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
