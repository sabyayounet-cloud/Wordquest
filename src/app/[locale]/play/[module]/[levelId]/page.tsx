import { getAllLevels } from '@/lib/content/content-loader';
import { ModuleSlug } from '@/types';
import PlayClient from './PlayClient';

const modules: ModuleSlug[] = [
  'phonics',
  'vocabulary',
  'spelling',
  'sentences',
  'grammar',
  'reading',
  'writing',
];

export function generateStaticParams() {
  const params: { module: string; levelId: string }[] = [];
  for (const mod of modules) {
    // Use English as reference — all languages share the same level IDs
    const levels = getAllLevels('en', mod);
    for (const level of levels) {
      params.push({ module: mod, levelId: level.id });
    }
  }
  return params;
}

interface PlayPageProps {
  params: Promise<{ module: string; levelId: string }>;
}

export default function PlayPage({ params }: PlayPageProps) {
  return <PlayClient params={params} />;
}
