import type { CurrentUser, Question } from '@/api';
import { PERMISSIONS } from '@/constants';

// Cosmetic gating only: the API enforces who may actually edit.
export function canEditQuestion(
  user: Pick<CurrentUser, 'id'> | undefined,
  permissions: readonly string[],
  question: Pick<Question, 'authorId'>,
): boolean {
  if (!user) return false;
  if (permissions.includes(PERMISSIONS.QUESTION_EDIT_ANY)) return true;
  return permissions.includes(PERMISSIONS.QUESTION_EDIT_OWN) && user.id === question.authorId;
}
