import type { CurrentUser, Question } from '@/api';
import { PERMISSIONS, REVIEW_STATUS, ROLES } from '@/constants';

// Cosmetic gating only: the API enforces who may actually edit.
export function canEditQuestion(
  user: Pick<CurrentUser, 'id'> | undefined,
  permissions: readonly string[],
  question: Pick<Question, 'authorId' | 'review'>,
): boolean {
  if (!user) return false;
  // A rejected submission is final; the submitter adds a new question instead.
  if (question.review?.status === REVIEW_STATUS.REJECTED) return false;
  if (permissions.includes(PERMISSIONS.QUESTION_EDIT_ANY)) return true;
  return permissions.includes(PERMISSIONS.QUESTION_EDIT_OWN) && user.id === question.authorId;
}

// Cosmetic gating only: the API rejects review actions from anyone but reviewers.
export function canReviewQuestion(user: Pick<CurrentUser, 'role'> | undefined): boolean {
  return user?.role === ROLES.REVIEWER;
}
