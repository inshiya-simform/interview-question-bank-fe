import { reviewConflictDetailsSchema } from '@/api';
import type { ReviewConflictDetails, ReviewPerson } from '@/api';
import {
  BULK_FAILURE_CODE,
  MESSAGES,
  REVIEW_CONFLICT_REASON,
  REVIEW_STATUS_LABEL,
} from '@/constants';

// The one place a 409 reason becomes user-facing copy, shared by the single and bulk flows.
export function conflictMessage(conflict: ReviewConflictDetails): string {
  switch (conflict.reason) {
    case REVIEW_CONFLICT_REASON.LOCKED:
      return MESSAGES.REVIEW_LOCKED(conflict.lockedBy.name);
    case REVIEW_CONFLICT_REASON.ALREADY_REVIEWED:
      return MESSAGES.REVIEW_ALREADY_DECIDED(
        REVIEW_STATUS_LABEL[conflict.status],
        conflict.reviewedBy?.name ?? null,
      );
    case REVIEW_CONFLICT_REASON.EDITED_SINCE_LOADED:
      return MESSAGES.REVIEW_EDITED_SINCE_LOADED;
    default: {
      const unreachable: never = conflict;
      return unreachable;
    }
  }
}

interface BulkFailure {
  code: string;
  message: string;
  details?: unknown;
}

// Per-item reason for a bulk failure: structured conflict first, then the known codes.
export function bulkFailureReason({ code, message, details }: BulkFailure): string {
  const conflict = reviewConflictDetailsSchema.safeParse(details);
  if (conflict.success) return conflictMessage(conflict.data);
  if (code === BULK_FAILURE_CODE.NOT_FOUND) return MESSAGES.BULK_REASON_NOT_FOUND;
  if (code === BULK_FAILURE_CODE.CONFLICT) return MESSAGES.BULK_REASON_CONFLICT;
  return message;
}

export const lockOwnerOf = (
  lock: { lockedBy: ReviewPerson } | null | undefined,
  userId: string | undefined,
): ReviewPerson | undefined => (lock && lock.lockedBy.id !== userId ? lock.lockedBy : undefined);
