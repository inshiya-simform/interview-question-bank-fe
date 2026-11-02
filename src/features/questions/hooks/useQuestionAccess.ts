import type { Question } from '@/api';
import { REVIEW_STATUS } from '@/constants';
import { useSession } from '@/features/auth';
import { usePermissions } from '@/hooks/usePermissions';
import { canEditQuestion } from '@/utils/permissions';

// What the viewer may do with a question and which review chip it carries, shared by the list
// card and the detail page.
export function useQuestionAccess(question: Question) {
  const { user } = useSession();
  const { permissions } = usePermissions();

  return {
    canEdit: canEditQuestion(user, permissions, question),
    // Live questions with no pending work carry no chip; others never receive `review`.
    reviewChip:
      question.review && question.review.status !== REVIEW_STATUS.APPROVED
        ? { status: question.review.status, isEdit: Boolean(question.review.revision) }
        : null,
  };
}
