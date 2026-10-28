import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { DEFAULT_PAGE, NOTIFICATION_FILTER } from '@/constants';
import { QUERY_KEYS } from './query-keys';
import { notificationListParamsSchema } from './type/notifications/notifications-list';
import type {
  NotificationListParams,
  NotificationListResponse,
} from './type/notifications/notifications-list';
import type { Notification, UnreadCountResponse } from './type/notifications/shared';

// Pure cache transforms shared by the mutation hooks and the live stream handler.

export interface NotificationCacheSnapshot {
  lists: [QueryKey, NotificationListResponse | undefined][];
  unread: UnreadCountResponse | undefined;
}

function listParams(key: QueryKey): NotificationListParams | undefined {
  // Key shape: ['notifications', 'list', userId, params]
  const parsed = notificationListParamsSchema.safeParse(key[3]);
  return parsed.success ? parsed.data : undefined;
}

export function isFirstPage(key: QueryKey): boolean {
  return (listParams(key)?.page ?? DEFAULT_PAGE) === DEFAULT_PAGE;
}

function matchesFilter(params: NotificationListParams | undefined, notification: Notification) {
  return params?.status !== NOTIFICATION_FILTER.UNREAD || !notification.read;
}

export function snapshotNotifications(
  queryClient: QueryClient,
  userId: string,
): NotificationCacheSnapshot {
  return {
    lists: queryClient.getQueriesData<NotificationListResponse>({
      queryKey: QUERY_KEYS.NOTIFICATION_LISTS(userId),
    }),
    unread: queryClient.getQueryData<UnreadCountResponse>(
      QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT(userId),
    ),
  };
}

export function restoreNotifications(
  queryClient: QueryClient,
  userId: string,
  snapshot: NotificationCacheSnapshot,
) {
  snapshot.lists.forEach(([key, data]) => queryClient.setQueryData(key, data));
  queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT(userId), snapshot.unread);
}

// Sets the server-authoritative unread count on the badge query and every cached list.
export function setUnreadCount(queryClient: QueryClient, userId: string, unreadCount: number) {
  queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT(userId), { unreadCount });
  queryClient.setQueriesData<NotificationListResponse>(
    { queryKey: QUERY_KEYS.NOTIFICATION_LISTS(userId) },
    (data) => (data ? { ...data, unreadCount } : data),
  );
}

function adjustUnread(queryClient: QueryClient, userId: string, delta: number) {
  const next = (count: number) => Math.max(0, count + delta);
  queryClient.setQueryData<UnreadCountResponse>(
    QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT(userId),
    (data) => (data ? { unreadCount: next(data.unreadCount) } : data),
  );
  queryClient.setQueriesData<NotificationListResponse>(
    { queryKey: QUERY_KEYS.NOTIFICATION_LISTS(userId) },
    (data) => (data ? { ...data, unreadCount: next(data.unreadCount) } : data),
  );
}

function isCached(snapshot: NotificationCacheSnapshot, id: string) {
  return snapshot.lists.some(([, data]) => data?.items.some((item) => item.id === id));
}

// Adds a live notification to the cached first pages. Skipped entirely when the id is already
// cached (the list was refetched after `ready`), so counts are never incremented twice.
export function applyIncomingNotification(
  queryClient: QueryClient,
  userId: string,
  notification: Notification,
) {
  if (isCached(snapshotNotifications(queryClient, userId), notification.id)) return;

  queryClient
    .getQueriesData<NotificationListResponse>({
      queryKey: QUERY_KEYS.NOTIFICATION_LISTS(userId),
      predicate: (query) => isFirstPage(query.queryKey),
    })
    .forEach(([key, data]) => {
      if (!data || !matchesFilter(listParams(key), notification)) return;
      queryClient.setQueryData<NotificationListResponse>(key, {
        ...data,
        items: [notification, ...data.items].slice(0, data.limit),
        total: data.total + 1,
      });
    });
  if (!notification.read) adjustUnread(queryClient, userId, 1);
}

export function applyMarkRead(queryClient: QueryClient, userId: string, id: string) {
  let wasUnread = false;
  queryClient
    .getQueriesData<NotificationListResponse>({ queryKey: QUERY_KEYS.NOTIFICATION_LISTS(userId) })
    .forEach(([key, data]) => {
      const target = data?.items.find((item) => item.id === id);
      if (!data || !target) return;
      wasUnread ||= !target.read;
      const isUnreadView = listParams(key)?.status === NOTIFICATION_FILTER.UNREAD;
      queryClient.setQueryData<NotificationListResponse>(key, {
        ...data,
        items: isUnreadView
          ? data.items.filter((item) => item.id !== id)
          : data.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
        total: isUnreadView ? Math.max(0, data.total - 1) : data.total,
      });
    });
  if (wasUnread) adjustUnread(queryClient, userId, -1);
}

export function applyMarkAllRead(queryClient: QueryClient, userId: string) {
  queryClient
    .getQueriesData<NotificationListResponse>({ queryKey: QUERY_KEYS.NOTIFICATION_LISTS(userId) })
    .forEach(([key, data]) => {
      if (!data) return;
      const isUnreadView = listParams(key)?.status === NOTIFICATION_FILTER.UNREAD;
      queryClient.setQueryData<NotificationListResponse>(key, {
        ...data,
        items: isUnreadView ? [] : data.items.map((item) => ({ ...item, read: true })),
        total: isUnreadView ? 0 : data.total,
        unreadCount: 0,
      });
    });
  queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT(userId), { unreadCount: 0 });
}
