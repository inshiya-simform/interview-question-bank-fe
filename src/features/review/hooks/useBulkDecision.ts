import { useState } from 'react';
import { toast } from 'react-toastify';
import { useBulkApproveMutation, useBulkRejectMutation } from '@/api/hooks';
import type { BulkDecisionResponse } from '@/api';
import { BULK_FAILURE_CODE, MESSAGES } from '@/constants';

const countByCode = (failed: BulkDecisionResponse['failed'], code: string) =>
  failed.filter((item) => item.code === code).length;

// Failures are reported per cause so the reviewer knows why a question was skipped.
function notifyFailures(failed: BulkDecisionResponse['failed']) {
  const conflicts = countByCode(failed, BULK_FAILURE_CODE.CONFLICT);
  const notFound = countByCode(failed, BULK_FAILURE_CODE.NOT_FOUND);
  const other = failed.length - conflicts - notFound;
  if (conflicts > 0) toast.error(MESSAGES.BULK_FAILED_CONFLICT(conflicts));
  if (notFound > 0) toast.error(MESSAGES.BULK_FAILED_NOT_FOUND(notFound));
  if (other > 0) toast.error(MESSAGES.BULK_FAILED_OTHER(other));
}

// API errors are toasted centrally, so only the per-question outcome is handled here.
export function useBulkDecision(selectedIds: readonly string[], onDone: () => void) {
  const [isRejecting, setIsRejecting] = useState(false);
  const approveMutation = useBulkApproveMutation();
  const rejectMutation = useBulkRejectMutation();

  const handleResult = (
    result: BulkDecisionResponse,
    successMessage: (count: number) => string,
  ) => {
    if (result.succeeded.length > 0) toast.success(successMessage(result.succeeded.length));
    notifyFailures(result.failed);
    setIsRejecting(false);
    onDone();
  };

  const approve = () =>
    approveMutation.mutate(
      { ids: [...selectedIds] },
      { onSuccess: (result) => handleResult(result, MESSAGES.BULK_APPROVED) },
    );

  const reject = (note: string) =>
    rejectMutation.mutate(
      { ids: [...selectedIds], note },
      { onSuccess: (result) => handleResult(result, MESSAGES.BULK_REJECTED) },
    );

  return {
    isPending: approveMutation.isPending || rejectMutation.isPending,
    isRejectPending: rejectMutation.isPending,
    isRejecting,
    approve,
    openReject: () => setIsRejecting(true),
    closeReject: () => setIsRejecting(false),
    reject,
  };
}
