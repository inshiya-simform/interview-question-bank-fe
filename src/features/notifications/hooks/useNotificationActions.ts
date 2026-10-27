import { useMarkAllNotificationsReadMutation, useMarkNotificationReadMutation } from '@/api/hooks';
import type { Notification } from '@/api';

// Shared by the bell panel and the full list so both mark things read the same way.
export function useNotificationActions() {
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  return {
    openNotification: (notification: Notification) => {
      if (!notification.isRead) markRead.mutate(notification.id);
    },
    markAllRead: () => markAllRead.mutate(),
    isMarkingAll: markAllRead.isPending,
  };
}
