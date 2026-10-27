import { NOTIFICATION_COPY } from '@/constants';
import type { Notification } from '@/api';
import { formatRelativeTime } from '@/utils/relativeTime';
import { NOTIFICATION_ICONS } from '../constants';

export function useNotificationItem(notification: Notification) {
  return {
    icon: NOTIFICATION_ICONS[notification.type],
    timeLabel: formatRelativeTime(notification.createdAt),
    // Unread state is also a dot, tint and bold title, so say it in text for screen readers.
    stateLabel: notification.isRead
      ? NOTIFICATION_COPY.READ_PREFIX
      : NOTIFICATION_COPY.UNREAD_PREFIX,
  };
}
