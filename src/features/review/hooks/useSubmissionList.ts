import { useQuestionCountsQuery, useSubmissionsQuery } from '@/api/hooks';
import { DEFAULT_PAGE, REVIEW_PAGE_SIZE } from '@/constants';
import type { StatusTab } from '@/constants';
import { useSession } from '@/features/auth';
import { tabToStatuses } from '@/utils/reviewStatus';
import { countsFromApi } from '../selectors';
import { useReviewFilters } from './useReviewFilters';

// Shared by My submissions and the review queue: the URL drives a server-side query.
export function useSubmissionList(tabs: readonly StatusTab[], fallback: StatusTab) {
  const { user } = useSession();
  const { filters, setStatus, setPage } = useReviewFilters(tabs, fallback);
  const { data, isPending, isError, refetch } = useSubmissionsQuery(user?.id, {
    page: filters.page,
    limit: REVIEW_PAGE_SIZE,
    status: tabToStatuses(filters.status),
  });
  const { data: countsData } = useQuestionCountsQuery(user?.id);

  const total = data?.total ?? 0;
  const totalPages = Math.max(DEFAULT_PAGE, Math.ceil(total / REVIEW_PAGE_SIZE));

  return {
    tabs,
    activeTab: filters.status,
    counts: countsFromApi(countsData?.counts ?? {}),
    items: data?.questions ?? [],
    total,
    page: Math.min(filters.page, totalPages),
    totalPages,
    isLoading: isPending,
    isError,
    refetch: () => void refetch(),
    setStatus,
    setPage,
  };
}
