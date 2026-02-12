'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Language } from '@/types';

const flags: Record<Language, string> = { en: '🇬🇧', de: '🇩🇪', nl: '🇳🇱' };

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('languages');

  const switchLocale = (newLocale: Language) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-1">
      {(['en', 'de', 'nl'] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => switchLocale(lang)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            locale === lang
              ? 'bg-purple-500/80 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
          title={t(lang)}
        >
          {flags[lang]}
        </button>
      ))}
    </div>
  );
}
