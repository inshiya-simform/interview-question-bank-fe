import { useId } from 'react';
import type { Question } from '@/api';
import { useSession } from '@/features/auth';
import { useDisclosure } from '@/hooks/useDisclosure';
import { usePermissions } from '@/hooks/usePermissions';
import { REVIEW_STATUS } from '@/constants';
import { canEditQuestion } from '@/utils/permissions';

export function useQuestionItem(question: Question) {
  const { isOpen, toggle } = useDisclosure();
  const { user } = useSession();
  const { permissions } = usePermissions();
  const id = useId();
  return {
    isOpen,
    toggle,
    triggerId: id,
    panelId: `${id}-panel`,
    canEdit: canEditQuestion(user, permissions, question),
    // Live questions with no pending work carry no chip; others never receive `review`.
    reviewChip:
      question.review && question.review.status !== REVIEW_STATUS.APPROVED
        ? { status: question.review.status, isEdit: Boolean(question.review.revision) }
        : null,
  };
}
