import type { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { applyIncomingNotification } from '@/api/notification-cache';
import type { Notification } from '@/api';
import { TOASTED_NOTIFICATION_TYPES } from '@/constants';
import { presentNotification } from './notificationPresenter';

function shouldToast(notification: Notification) {
  return TOASTED_NOTIFICATION_TYPES.some((type) => type === notification.type);
}

// Cache first, so the bell is already correct when the toast appears.
export function handleIncomingNotification(
  queryClient: QueryClient,
  userId: string,
  notification: Notification,
) {
  applyIncomingNotification(queryClient, userId, notification);
  if (!shouldToast(notification)) return;
  const { title, body } = presentNotification(notification);
  toast.info(`${title}: ${body}`);
}
