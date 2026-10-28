import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  applyMarkAllRead,
  applyMarkRead,
  restoreNotifications,
  setUnreadCount,
  snapshotNotifications,
} from '../notification-cache';
import type { NotificationCacheSnapshot } from '../notification-cache';
import { QUERY_KEYS } from '../query-keys';
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../service/notifications.service';
import type { NotificationListParams } from '../type/notifications/notifications-list';

export function useNotificationList(userId: string | undefined, params: NotificationListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS(userId ?? '', params),
    queryFn: () => getNotifications(params),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

export function useUnreadCount(userId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT(userId ?? ''),
    queryFn: getUnreadCount,
    enabled: Boolean(userId),
    select: (data) => data.unreadCount,
  });
}

// Optimistic: the cache changes at once, rolls back on error, and the returned count (the
// server's truth) replaces the guess on success.
export function useMarkNotificationRead(userId: string | undefined) {
  const queryClient = useQueryClient();
  const scope = userId ?? '';
  return useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id): Promise<NotificationCacheSnapshot> => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS_LIST });
      const snapshot = snapshotNotifications(queryClient, scope);
      applyMarkRead(queryClient, scope, id);
      return snapshot;
    },
    onError: (_error, _id, snapshot) => {
      if (snapshot) restoreNotifications(queryClient, scope, snapshot);
    },
    onSuccess: ({ unreadCount }) => setUnreadCount(queryClient, scope, unreadCount),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION_LISTS(scope) }),
  });
}

export function useMarkAllNotificationsRead(userId: string | undefined) {
  const queryClient = useQueryClient();
  const scope = userId ?? '';
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async (): Promise<NotificationCacheSnapshot> => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS_LIST });
      const snapshot = snapshotNotifications(queryClient, scope);
      applyMarkAllRead(queryClient, scope);
      return snapshot;
    },
    onError: (_error, _variables, snapshot) => {
      if (snapshot) restoreNotifications(queryClient, scope, snapshot);
    },
    onSuccess: ({ unreadCount }) => setUnreadCount(queryClient, scope, unreadCount),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION_LISTS(scope) }),
  });
}
