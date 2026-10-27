import { useNotificationsQuery } from '@/api/hooks';
import { DEFAULT_PAGE, NOTIFICATIONS_PAGE_SIZE } from '@/constants';
import { useSession } from '@/features/auth';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationFilters } from './useNotificationFilters';

export function useNotificationList() {
  const { user } = useSession();
  const { filters, setFilter, setPage } = useNotificationFilters();
  const { openNotification, markAllRead, isMarkingAll } = useNotificationActions();
  const { data, isPending, isError, refetch } = useNotificationsQuery(user?.id, {
    page: filters.page,
    limit: NOTIFICATIONS_PAGE_SIZE,
    filter: filters.filter,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(DEFAULT_PAGE, Math.ceil(total / NOTIFICATIONS_PAGE_SIZE));

  return {
    filter: filters.filter,
    counts: { all: data?.totalAll ?? 0, unread: data?.unreadCount ?? 0 },
    items: data?.notifications ?? [],
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
