import {
  DEFAULT_PAGE,
  NOTIFICATION_FILTER,
  NOTIFICATION_MOCK_DELAY_MS,
  NOTIFICATIONS_PAGE_SIZE,
} from '@/constants';
import { createMockNotifications } from '../mock/notifications.mock';
import {
  notificationListParamsSchema,
  notificationListResponseSchema,
} from '../type/notifications/notifications-list';
import type {
  NotificationListParams,
  NotificationListResponse,
} from '../type/notifications/notifications-list';

// Mock backend: the notifications API is not available yet. The functions keep the shape the real
// service will have (validated params in, parsed response out), so only their bodies change later.
let store = createMockNotifications();

const respondAfterDelay = <T>(value: () => T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value()), NOTIFICATION_MOCK_DELAY_MS));

export function getNotifications(
  params: NotificationListParams,
): Promise<NotificationListResponse> {
  const {
    page = DEFAULT_PAGE,
    limit = NOTIFICATIONS_PAGE_SIZE,
    filter,
  } = notificationListParamsSchema.parse(params);

  return respondAfterDelay(() => {
    const matches =
      filter === NOTIFICATION_FILTER.UNREAD ? store.filter((item) => !item.isRead) : store;
    const start = (page - 1) * limit;
    return notificationListResponseSchema.parse({
      notifications: matches.slice(start, start + limit),
      page,
      limit,
      total: matches.length,
      totalAll: store.length,
      unreadCount: store.filter((item) => !item.isRead).length,
    });
  });
}

export function markNotificationRead(id: string): Promise<void> {
  return respondAfterDelay(() => {
    store = store.map((item) => (item.id === id ? { ...item, isRead: true } : item));
  });
}

export function markAllNotificationsRead(): Promise<void> {
  return respondAfterDelay(() => {
    store = store.map((item) => ({ ...item, isRead: true }));
  });
}
