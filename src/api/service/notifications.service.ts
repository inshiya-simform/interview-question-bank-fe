import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { markAllReadResponseSchema, markReadResponseSchema } from '../type/notifications/mark-read';
import type { MarkAllReadResponse, MarkReadResponse } from '../type/notifications/mark-read';
import {
  notificationListParamsSchema,
  notificationListResponseSchema,
} from '../type/notifications/notifications-list';
import type {
  NotificationListParams,
  NotificationListResponse,
} from '../type/notifications/notifications-list';
import { unreadCountResponseSchema } from '../type/notifications/shared';
import type { UnreadCountResponse } from '../type/notifications/shared';

export async function getNotifications(
  params: NotificationListParams,
): Promise<NotificationListResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST, {
    params: notificationListParamsSchema.parse(params),
  });
  return notificationListResponseSchema.parse(data);
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  return unreadCountResponseSchema.parse(data);
}

export async function markNotificationRead(id: string): Promise<MarkReadResponse> {
  const { data } = await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.READ(id));
  return markReadResponseSchema.parse(data);
}

export async function markAllNotificationsRead(): Promise<MarkAllReadResponse> {
  const { data } = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
  return markAllReadResponseSchema.parse(data);
}
