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
import { useReviewSession } from './useReviewSession';

// Conflicts are mapped by the session; other API errors are toasted centrally.
// A conflict never closes the note modal, so the reviewer's draft survives it.
export function useReviewDrawer(
  submission: ReviewedQuestion,
  onClose: () => void,
  onReload: () => void,
) {
  const { user } = useSession();
  const [mode, setMode] = useState<DecisionMode | null>(null);
  const approveMutation = useApproveQuestionMutation();
  const changesMutation = useRequestChangesMutation();
  const rejectMutation = useRejectQuestionMutation();

  const isReviewable =
    canReviewQuestion(user) && submission.status === REVIEW_STATUS.PENDING_REVIEW;
  const session = useReviewSession(submission.id, submission.updatedAt, isReviewable, onReload);
  const expectedUpdatedAt = submission.updatedAt;

  const finish = (message: string) => {
    toast.success(message);
    setMode(null);
    onClose();
  };

  const approve = () =>
    approveMutation.mutate(
      { id: submission.id, payload: { expectedUpdatedAt } },
      { onSuccess: () => finish(MESSAGES.QUESTION_APPROVED), onError: session.handleError },
    );

  const submitNote = (note: string) => {
    if (mode === null) return;
    const payload = { note, expectedUpdatedAt };
    if (mode === DECISION_MODE.CHANGES) {
      changesMutation.mutate(
        { id: submission.id, payload },
        { onSuccess: () => finish(MESSAGES.CHANGES_REQUESTED), onError: session.handleError },
      );
    } else {
      rejectMutation.mutate(
        { id: submission.id, payload },
        { onSuccess: () => finish(MESSAGES.QUESTION_REJECTED), onError: session.handleError },
      );
    }
  };

  return {
    isEdit: isEditSubmission(submission),
    content: toSubmittedContent(submission),
    live: toLiveContent(submission),
    canDecide: isReviewable,
    canAct: session.canAct,
    banner: session.banner,
    isClaiming: session.isClaiming,
    runBannerAction: session.runBannerAction,
    isPending: approveMutation.isPending || changesMutation.isPending || rejectMutation.isPending,
    mode,
    approve,
    openChanges: () => setMode(DECISION_MODE.CHANGES),
    openReject: () => setMode(DECISION_MODE.REJECT),
    closeModal: () => setMode(null),
    submitNote,
  };
}
