import { useState } from 'react';
import type { ReviewedQuestion } from '@/api';
import { QUEUE_TABS, REVIEW_QUEUE_REFETCH_MS, REVIEW_STATUS } from '@/constants';
import { lockOwnerOf } from '../conflicts';
import { useSubmissionList } from './useSubmissionList';

export function useReviewQueue() {
  const { userId, reload, ...list } = useSubmissionList(
    QUEUE_TABS,
    REVIEW_STATUS.PENDING_REVIEW,
    REVIEW_QUEUE_REFETCH_MS,
  );
  // Frozen when opened: the list refetches underneath, but the reviewer decides on what they saw.
  const [selected, setSelected] = useState<ReviewedQuestion>();

  const reloadSelected = async () => {
    const fresh = (await reload()).find((item) => item.id === selected?.id);
    if (fresh) setSelected(fresh);
  };

  return {
    ...list,
    selected,
    openReview: setSelected,
    closeReview: () => setSelected(undefined),
    reloadSelected,
    lockOwnerOf: (item: ReviewedQuestion) => lockOwnerOf(item.reviewLock, userId),
  };
}
