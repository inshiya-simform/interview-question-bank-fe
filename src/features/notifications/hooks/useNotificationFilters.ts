import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE } from '@/constants';
import type { NotificationFilter } from '@/constants';
import { buildNotificationSearchParams, parseNotificationFilters } from '../filters';

// Tab and page live in the URL so the view is shareable and survives a refresh.
export function useNotificationFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseNotificationFilters(searchParams);

  return {
    filters,
    setFilter: (filter: NotificationFilter) =>
      setSearchParams(buildNotificationSearchParams({ filter, page: DEFAULT_PAGE })),
    setPage: (page: number) => setSearchParams(buildNotificationSearchParams({ ...filters, page })),
  };
}
