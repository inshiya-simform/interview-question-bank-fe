import { useState } from 'react';
import { toast } from 'react-toastify';
import { MESSAGES, REVIEW_KIND, REVIEW_STATUS } from '@/constants';
import { DECISION_MODE } from '../constants';
import type { DecisionMode } from '../constants';
import { approveSubmission, rejectSubmission, requestSubmissionChanges } from '../mock/reviewStore';
import { useSubmissions } from './useSubmissions';

export function useReviewDrawer(submissionId: string | null, onClose: () => void) {
  const all = useSubmissions();
  const [mode, setMode] = useState<DecisionMode | null>(null);
  const submission = all.find((item) => item.id === submissionId);

  const approve = () => {
    if (!submission) return;
    approveSubmission(submission.id);
    toast.success(MESSAGES.QUESTION_APPROVED);
    onClose();
  };

  const submitNote = (text: string) => {
    if (!submission || mode === null) return;
    if (mode === DECISION_MODE.CHANGES) {
      requestSubmissionChanges(submission.id, text);
      toast.success(MESSAGES.CHANGES_REQUESTED);
    } else {
      rejectSubmission(submission.id, text);
      toast.success(MESSAGES.QUESTION_REJECTED);
    }
    setMode(null);
    onClose();
  };

  return {
    submission,
    isEdit: submission?.kind === REVIEW_KIND.EDIT && Boolean(submission.live),
    canDecide: submission?.status === REVIEW_STATUS.PENDING_REVIEW,
    mode,
    approve,
    openChanges: () => setMode(DECISION_MODE.CHANGES),
    openReject: () => setMode(DECISION_MODE.REJECT),
    closeModal: () => setMode(null),
    submitNote,
  };
}
