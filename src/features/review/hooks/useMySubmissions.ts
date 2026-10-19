import { ALL_STATUSES, REVIEW_PAGE_SIZE, SUBMISSION_TABS } from '@/constants';
import { countByStatus, paginate, selectMine } from '../selectors';
import { useReviewFilters } from './useReviewFilters';
import { useSubmissions } from './useSubmissions';

export function useMySubmissions() {
  const { filters, setStatus, setPage } = useReviewFilters(SUBMISSION_TABS, ALL_STATUSES);
  const all = useSubmissions();
  const filtered = selectMine(all, filters.status);
  const totalPages = Math.max(1, Math.ceil(filtered.length / REVIEW_PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);

  return {
    tabs: SUBMISSION_TABS,
    activeTab: filters.status,
    counts: countByStatus(all.filter((item) => item.isMine)),
    items: paginate(filtered, page, REVIEW_PAGE_SIZE),
    total: filtered.length,
    page,
    totalPages,
    setStatus,
    setPage,
  };
}
