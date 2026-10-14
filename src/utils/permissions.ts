import type { CurrentUser, Question } from '@/api';
import { ROLES } from '@/constants';

// Cosmetic gating only: the API enforces who may actually edit.
export function canEditQuestion(
  user: Pick<CurrentUser, 'id' | 'role'> | undefined,
  question: Pick<Question, 'authorId'>,
): boolean {
  if (!user) return false;
  if (user.role === ROLES.REVIEWER) return true;
  return user.role === ROLES.AUTHOR && user.id === question.authorId;
}
