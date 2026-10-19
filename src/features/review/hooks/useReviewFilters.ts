import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE } from '@/constants';
import type { StatusTab } from '@/constants';
import { buildReviewSearchParams, parseReviewFilters } from '../filters';

// Tab and page live in the URL so the view is shareable and survives a refresh.
export function useReviewFilters(allowed: readonly StatusTab[], fallback: StatusTab) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseReviewFilters(searchParams, allowed, fallback);

  return {
    filters,
    setStatus: (status: StatusTab) =>
      setSearchParams(buildReviewSearchParams({ status, page: DEFAULT_PAGE }, fallback)),
    setPage: (page: number) =>
      setSearchParams(buildReviewSearchParams({ ...filters, page }, fallback)),
  };
}
