import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useApproveQuestionMutation,
  useRejectQuestionMutation,
  useRequestChangesMutation,
} from '@/api/hooks';
import type { ReviewedQuestion } from '@/api';
import { MESSAGES, REVIEW_STATUS } from '@/constants';
import { useSession } from '@/features/auth';
import { canReviewQuestion } from '@/utils/permissions';
import { DECISION_MODE } from '../constants';
import type { DecisionMode } from '../constants';
import { isEditSubmission, toLiveContent, toSubmittedContent } from '../selectors';

// API errors are toasted centrally, so only success paths are handled here.
export function useReviewDrawer(submission: ReviewedQuestion | undefined, onClose: () => void) {
  const { user } = useSession();
  const [mode, setMode] = useState<DecisionMode | null>(null);
  const approveMutation = useApproveQuestionMutation();
  const changesMutation = useRequestChangesMutation();
  const rejectMutation = useRejectQuestionMutation();

  const finish = (message: string) => {
    toast.success(message);
    setMode(null);
    onClose();
  };

  const approve = () => {
    if (!submission) return;
    approveMutation.mutate(submission.id, { onSuccess: () => finish(MESSAGES.QUESTION_APPROVED) });
  };

  const submitNote = (note: string) => {
    if (!submission || mode === null) return;
    if (mode === DECISION_MODE.CHANGES) {
      changesMutation.mutate(
        { id: submission.id, payload: { note } },
        { onSuccess: () => finish(MESSAGES.CHANGES_REQUESTED) },
      );
    } else {
      rejectMutation.mutate(
        { id: submission.id, payload: { note } },
        { onSuccess: () => finish(MESSAGES.QUESTION_REJECTED) },
      );
    }
  };

  return {
    isEdit: submission !== undefined && isEditSubmission(submission),
    content: submission ? toSubmittedContent(submission) : undefined,
    live: submission ? toLiveContent(submission) : undefined,
    canDecide: canReviewQuestion(user) && submission?.status === REVIEW_STATUS.PENDING_REVIEW,
    isPending: approveMutation.isPending || changesMutation.isPending || rejectMutation.isPending,
    mode,
    approve,
    openChanges: () => setMode(DECISION_MODE.CHANGES),
    openReject: () => setMode(DECISION_MODE.REJECT),
    closeModal: () => setMode(null),
    submitNote,
  };
}
