import { useNotificationList as useNotificationListQuery } from '@/api/hooks';
import { DEFAULT_PAGE, NOTIFICATION_FILTER, NOTIFICATIONS_PAGE_SIZE } from '@/constants';
import { useSession } from '@/features/auth';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationFilters } from './useNotificationFilters';

export function useNotificationList() {
  const { user } = useSession();
  const { filters, setFilter, setPage } = useNotificationFilters();
  const { openNotification, markAllRead, isMarkingAll } = useNotificationActions();
  const { data, isPending, isError, refetch } = useNotificationListQuery(user?.id, {
    page: filters.page,
    limit: NOTIFICATIONS_PAGE_SIZE,
    status: filters.filter,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(DEFAULT_PAGE, Math.ceil(total / NOTIFICATIONS_PAGE_SIZE));

  return {
    filter: filters.filter,
    // The API reports a total only for the active filter, so the other tab shows no count.
    counts: {
      all: filters.filter === NOTIFICATION_FILTER.ALL ? total : undefined,
      unread: data?.unreadCount ?? 0,
    },
    items: data?.items ?? [],
    total,
    page: Math.min(filters.page, totalPages),
    totalPages,
    isLoading: isPending,
    isError,
    refetch: () => void refetch(),
    setFilter,
    setPage,
    openNotification,
    markAllRead,
    isMarkingAll,
  };
}
