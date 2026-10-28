import { NOTIFICATION_COPY } from '@/constants';
import type { Notification } from '@/api';
import { formatRelativeTime } from '@/utils/relativeTime';
import { presentNotification } from '../notificationPresenter';

export function useNotificationItem(notification: Notification) {
  const { title, body, glyph } = presentNotification(notification);
  return {
    title,
    body,
    icon: glyph,
    timeLabel: formatRelativeTime(notification.createdAt),
    // Unread state is also a dot, tint and bold title, so say it in text for screen readers.
    stateLabel: notification.read ? NOTIFICATION_COPY.READ_PREFIX : NOTIFICATION_COPY.UNREAD_PREFIX,
  };
}
