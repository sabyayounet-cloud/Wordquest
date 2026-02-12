import { Language, ModuleSlug, AgeGroup, LevelData, Question } from '@/types';
import { shuffleArray } from '@/lib/utils';

// Import all content
import enPhonics from '@/data/content/en/phonics.json';
import enVocabulary from '@/data/content/en/vocabulary.json';
import enSpelling from '@/data/content/en/spelling.json';
import enSentences from '@/data/content/en/sentences.json';
import enGrammar from '@/data/content/en/grammar.json';
import enReading from '@/data/content/en/reading.json';
import enWriting from '@/data/content/en/writing.json';

import dePhonics from '@/data/content/de/phonics.json';
import deVocabulary from '@/data/content/de/vocabulary.json';
import deSpelling from '@/data/content/de/spelling.json';
import deSentences from '@/data/content/de/sentences.json';
import deGrammar from '@/data/content/de/grammar.json';
import deReading from '@/data/content/de/reading.json';
import deWriting from '@/data/content/de/writing.json';

import nlPhonics from '@/data/content/nl/phonics.json';
import nlVocabulary from '@/data/content/nl/vocabulary.json';
import nlSpelling from '@/data/content/nl/spelling.json';
import nlSentences from '@/data/content/nl/sentences.json';
import nlGrammar from '@/data/content/nl/grammar.json';
import nlReading from '@/data/content/nl/reading.json';
import nlWriting from '@/data/content/nl/writing.json';

interface ContentFile {
  module: string;
  language: string;
  levels: LevelData[];
}

const contentMap: Record<Language, Record<ModuleSlug, ContentFile>> = {
  en: {
    phonics: enPhonics as unknown as ContentFile,
    vocabulary: enVocabulary as unknown as ContentFile,
    spelling: enSpelling as unknown as ContentFile,
    sentences: enSentences as unknown as ContentFile,
    grammar: enGrammar as unknown as ContentFile,
    reading: enReading as unknown as ContentFile,
    writing: enWriting as unknown as ContentFile,
  },
  de: {
    phonics: dePhonics as unknown as ContentFile,
    vocabulary: deVocabulary as unknown as ContentFile,
    spelling: deSpelling as unknown as ContentFile,
    sentences: deSentences as unknown as ContentFile,
    grammar: deGrammar as unknown as ContentFile,
    reading: deReading as unknown as ContentFile,
    writing: deWriting as unknown as ContentFile,
  },
  nl: {
    phonics: nlPhonics as unknown as ContentFile,
    vocabulary: nlVocabulary as unknown as ContentFile,
    spelling: nlSpelling as unknown as ContentFile,
    sentences: nlSentences as unknown as ContentFile,
    grammar: nlGrammar as unknown as ContentFile,
    reading: nlReading as unknown as ContentFile,
    writing: nlWriting as unknown as ContentFile,
  },
};

export function getAllLevels(language: Language, moduleSlug: ModuleSlug): LevelData[] {
  const content = contentMap[language]?.[moduleSlug];
  if (!content) return [];
  return content.levels;
}

export function getLevelsByAgeGroup(
  language: Language,
  moduleSlug: ModuleSlug,
  ageGroup: AgeGroup
): LevelData[] {
  const allLevels = getAllLevels(language, moduleSlug);
  return allLevels.filter(level => level.ageGroup === ageGroup);
}

export function getLevelById(
  language: Language,
  moduleSlug: ModuleSlug,
  levelId: string
): LevelData | undefined {
  const allLevels = getAllLevels(language, moduleSlug);
  return allLevels.find(level => level.id === levelId);
}

export function getShuffledQuestions(level: LevelData): Question[] {
  const questions = [...level.questions];
  return shuffleArray(questions).map(q => {
    if (q.options) {
      return { ...q, options: shuffleArray(q.options) };
    }
    return q;
  });
}

export function getModuleLevelCount(language: Language, moduleSlug: ModuleSlug, ageGroup: AgeGroup): number {
  return getLevelsByAgeGroup(language, moduleSlug, ageGroup).length;
}

export function getAvailableModules(ageGroup: AgeGroup): ModuleSlug[] {
  const allModules: ModuleSlug[] = ['phonics', 'vocabulary', 'spelling', 'sentences', 'grammar', 'reading', 'writing'];
  if (ageGroup === '4-6') {
    return ['phonics', 'vocabulary', 'spelling', 'sentences', 'writing', 'reading'];
  }
  if (ageGroup === '7-9') {
    return allModules;
  }
  // 10-12 and 13-15 get all modules
  return allModules;
}
