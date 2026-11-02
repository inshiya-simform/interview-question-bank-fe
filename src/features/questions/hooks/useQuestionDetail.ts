import type { Question } from '@/api';
import { QUESTION_DETAIL_COPY } from '@/constants';
import { formatDate } from '@/utils/date';
import { useQuestionAccess } from './useQuestionAccess';

export function useQuestionDetail(question: Question) {
  return {
    ...useQuestionAccess(question),
    addedLabel: QUESTION_DETAIL_COPY.ADDED(formatDate(question.createdAt)),
    updatedLabel: QUESTION_DETAIL_COPY.UPDATED(formatDate(question.updatedAt)),
  };
}
