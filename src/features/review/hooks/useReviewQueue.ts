import { useState } from 'react';
import { QUEUE_TABS, REVIEW_STATUS } from '@/constants';
import { useSubmissionList } from './useSubmissionList';

export function useReviewQueue() {
  const list = useSubmissionList(QUEUE_TABS, REVIEW_STATUS.PENDING_REVIEW);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return {
    ...list,
    selectedId,
    selected: list.items.find((item) => item.id === selectedId),
    openReview: setSelectedId,
    closeReview: () => setSelectedId(null),
  };
}
