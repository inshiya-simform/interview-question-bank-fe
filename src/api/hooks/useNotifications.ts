import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../service/notifications.service';
import type { NotificationListParams } from '../type/notifications/notifications-list';

export function useNotificationsQuery(userId: string | undefined, params: NotificationListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS(userId ?? '', params),
    queryFn: () => getNotifications(params),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

// Read state affects every cached list and the unread badge, so refresh by the shared prefix.
export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS_LIST }),
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS_LIST }),
  });
}
