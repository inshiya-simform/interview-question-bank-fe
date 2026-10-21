import type { ReviewLock, ReviewPerson } from '@/api';
import { REVIEW_COPY, REVIEW_STATUS_LABEL } from '@/constants';
import type { ReviewStatus } from '@/constants';
import { formatTime } from '@/utils/date';

export const BANNER_ACTION = { RELOAD: 'reload', CLAIM: 'claim' } as const;
export type BannerAction = (typeof BANNER_ACTION)[keyof typeof BANNER_ACTION];

export interface ReviewBanner {
  message: string;
  action?: BannerAction;
}

export interface BannerInput {
  // Set when the question was decided; the person is known only when the API told us.
  decided?: { status?: ReviewStatus; by: ReviewPerson | null };
  isEdited: boolean;
  isLost: boolean;
  otherLock?: ReviewLock | { lockedBy: ReviewPerson; expiresAt: string };
  canClaim: boolean;
}

// One banner at a time, most blocking first.
export function buildBanner({
  decided,
  isEdited,
  isLost,
  otherLock,
  canClaim,
}: BannerInput): ReviewBanner | null {
  if (decided) {
    return {
      message: decided.status
        ? REVIEW_COPY.BANNER_ALREADY(REVIEW_STATUS_LABEL[decided.status], decided.by?.name ?? null)
        : REVIEW_COPY.BANNER_DECIDED_OTHER,
    };
  }
  if (isEdited) return { message: REVIEW_COPY.BANNER_EDITED, action: BANNER_ACTION.RELOAD };
  if (isLost) {
    return {
      message: otherLock
        ? REVIEW_COPY.BANNER_LOCK_LOST(otherLock.lockedBy.name)
        : REVIEW_COPY.BANNER_LOCK_LOST_GENERIC,
    };
  }
  if (otherLock) {
    return {
      message: REVIEW_COPY.BANNER_LOCKED_UNTIL(
        otherLock.lockedBy.name,
        formatTime(otherLock.expiresAt),
      ),
    };
  }
  if (canClaim) return { message: REVIEW_COPY.BANNER_LOCK_FREE, action: BANNER_ACTION.CLAIM };
  return null;
}
