'use client';

import { Question } from '@/types';
import { MultipleChoice } from './MultipleChoice';
import { TypingInput } from './TypingInput';
import { FillInBlank } from './FillInBlank';
import { DragAndDrop } from './DragAndDrop';
import { MatchPairs } from './MatchPairs';
import { TrueFalse } from './TrueFalse';

interface QuestionCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  switch (question.type) {
    case 'multiple-choice':
      return <MultipleChoice question={question} onAnswer={onAnswer} disabled={disabled} />;
    case 'typing':
      return <TypingInput question={question} onAnswer={onAnswer} disabled={disabled} />;
    case 'fill-in-blank':
      return <FillInBlank question={question} onAnswer={onAnswer} disabled={disabled} />;
    case 'drag-and-drop':
      return <DragAndDrop question={question} onAnswer={onAnswer} disabled={disabled} />;
    case 'match-pairs':
      return <MatchPairs question={question} onAnswer={onAnswer} disabled={disabled} />;
    case 'true-false':
      return <TrueFalse question={question} onAnswer={onAnswer} disabled={disabled} />;
    default:
      return <MultipleChoice question={question} onAnswer={onAnswer} disabled={disabled} />;
  }
}
