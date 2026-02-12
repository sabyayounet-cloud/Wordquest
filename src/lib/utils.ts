import { AgeGroup } from '@/types';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getAgeGroupFromAge(age: number): AgeGroup {
  if (age <= 6) return '4-6';
  if (age <= 9) return '7-9';
  if (age <= 12) return '10-12';
  return '13-15';
}

export function getAgeGroupLabel(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case '4-6': return 'Little Learners';
    case '7-9': return 'Word Explorers';
    case '10-12': return 'Sentence Builders';
    case '13-15': return 'Language Masters';
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getModuleColor(slug: string): string {
  const colors: Record<string, string> = {
    phonics: 'from-pink-400 to-rose-500',
    vocabulary: 'from-blue-400 to-indigo-500',
    spelling: 'from-green-400 to-emerald-500',
    sentences: 'from-yellow-400 to-orange-500',
    grammar: 'from-purple-400 to-violet-500',
    reading: 'from-cyan-400 to-teal-500',
    writing: 'from-red-400 to-pink-500',
  };
  return colors[slug] || 'from-gray-400 to-gray-500';
}

export function getModuleIcon(slug: string): string {
  const icons: Record<string, string> = {
    phonics: '🔤',
    vocabulary: '📖',
    spelling: '✏️',
    sentences: '💬',
    grammar: '📝',
    reading: '📚',
    writing: '✍️',
  };
  return icons[slug] || '📘';
}
