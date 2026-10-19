import { useState } from 'react';
import { QUEUE_TABS, REVIEW_PAGE_SIZE, REVIEW_STATUS } from '@/constants';
import { countByStatus, paginate, selectQueue } from '../selectors';
import { useReviewFilters } from './useReviewFilters';
import { useSubmissions } from './useSubmissions';

export function useReviewQueue() {
  const { filters, setStatus, setPage } = useReviewFilters(
    QUEUE_TABS,
    REVIEW_STATUS.PENDING_REVIEW,
  );
  const all = useSubmissions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filtered = selectQueue(all, filters.status);
  const totalPages = Math.max(1, Math.ceil(filtered.length / REVIEW_PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);

  return {
    tabs: QUEUE_TABS,
    activeTab: filters.status,
    counts: countByStatus(all),
    items: paginate(filtered, page, REVIEW_PAGE_SIZE),
    total: filtered.length,
    page,
    totalPages,
    selectedId,
    setStatus,
    setPage,
    openReview: setSelectedId,
    closeReview: () => setSelectedId(null),
  };
}
