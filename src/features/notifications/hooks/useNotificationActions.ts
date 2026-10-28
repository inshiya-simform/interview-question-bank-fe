import { useNavigate } from 'react-router-dom';
import { useMarkAllNotificationsRead, useMarkNotificationRead } from '@/api/hooks';
import type { Notification } from '@/api';
import { useSession } from '@/features/auth';
import { presentNotification } from '../notificationPresenter';

// Shared by the bell panel and the full list so both mark things read the same way.
export function useNotificationActions(onNavigate?: () => void) {
  const { user } = useSession();
  const navigate = useNavigate();
  const markRead = useMarkNotificationRead(user?.id);
  const markAllRead = useMarkAllNotificationsRead(user?.id);

  return {
    openNotification: (notification: Notification) => {
      if (!notification.read) markRead.mutate(notification.id);
      onNavigate?.();
      void navigate(presentNotification(notification).href);
    },
    markAllRead: () => markAllRead.mutate(),
    isMarkingAll: markAllRead.isPending,
  };
}
