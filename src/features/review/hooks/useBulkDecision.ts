import { useState } from 'react';
import { toast } from 'react-toastify';
import { useBulkApproveMutation, useBulkRejectMutation } from '@/api/hooks';
import type { BulkDecisionResponse, ReviewedQuestion } from '@/api';
import { MESSAGES, REVIEW_COPY } from '@/constants';
import { bulkFailureReason } from '../conflicts';
import { toSubmittedContent } from '../selectors';
import { buildExpectedUpdatedAt } from '../utils';

export interface BulkFailure {
  id: string;
  text: string;
  reason: string;
}

// API errors are toasted centrally, so only the per-question outcome is handled here.
export function useBulkDecision(
  items: readonly ReviewedQuestion[],
  selectedIds: readonly string[],
  onDone: () => void,
) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [failures, setFailures] = useState<BulkFailure[]>([]);
  const approveMutation = useBulkApproveMutation();
  const rejectMutation = useBulkRejectMutation();

  const toFailure = (failed: BulkDecisionResponse['failed'][number]): BulkFailure => {
    const item = items.find((candidate) => candidate.id === failed.id);
    return {
      id: failed.id,
      text: item ? toSubmittedContent(item).text : REVIEW_COPY.BULK_FAILED_UNKNOWN_QUESTION,
      reason: bulkFailureReason(failed),
    };
  };

  const handleResult = (
    result: BulkDecisionResponse,
    successMessage: (count: number) => string,
  ) => {
    const reviewed = result.succeeded.length;
    const skipped = result.failed.length;
    if (skipped === 0) toast.success(successMessage(reviewed));
    else toast.info(MESSAGES.BULK_SUMMARY(reviewed, skipped));
    setFailures(result.failed.map(toFailure));
    setIsRejecting(false);
    onDone();
  };

  const approve = () =>
    approveMutation.mutate(
      { ids: [...selectedIds], expectedUpdatedAt: buildExpectedUpdatedAt(items, selectedIds) },
      { onSuccess: (result) => handleResult(result, MESSAGES.BULK_APPROVED) },
    );

  const reject = (note: string) =>
    rejectMutation.mutate(
      {
        ids: [...selectedIds],
        note,
        expectedUpdatedAt: buildExpectedUpdatedAt(items, selectedIds),
      },
      { onSuccess: (result) => handleResult(result, MESSAGES.BULK_REJECTED) },
    );

  return {
    isPending: approveMutation.isPending || rejectMutation.isPending,
    isRejectPending: rejectMutation.isPending,
    isRejecting,
    failures,
    dismissFailures: () => setFailures([]),
    approve,
    openReject: () => setIsRejecting(true),
    closeReject: () => setIsRejecting(false),
    reject,
  };
}
