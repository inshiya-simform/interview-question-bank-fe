import type { Notification } from '@/api';
import { Icon } from '@/components';
import { NOTIFICATION_COPY } from '@/constants';
import { cn } from '@/utils/cn';
import { useNotificationItem } from '../hooks/useNotificationItem';
import './NotificationItem.css';

interface NotificationItemProps {
  notification: Notification;
  onOpen: (notification: Notification) => void;
  // The panel marks unread with a dot; the full list spells it out with a "New" label.
  variant: 'compact' | 'full';
}

export function NotificationItem({ notification, onOpen, variant }: NotificationItemProps) {
  const { title, body, icon, timeLabel, stateLabel } = useNotificationItem(notification);
  const isUnread = !notification.read;

  return (
    <li className="notif-item__row">
      <button
        type="button"
        className={cn('notif-item', `notif-item--${variant}`, isUnread && 'notif-item--unread')}
        onClick={() => onOpen(notification)}
      >
        <span className="notif-item__icon">
          <Icon name={icon} />
        </span>
        <span className="notif-item__text">
          <span className="notif-item__title">
            <span className="sr-only">{stateLabel}</span>
            {title}
          </span>
          <span className="notif-item__body">{body}</span>
          <time className="notif-item__time" dateTime={notification.createdAt}>
            {timeLabel}
          </time>
        </span>
        {isUnread && variant === 'compact' && (
          <span className="notif-item__dot" aria-hidden="true" />
        )}
        {isUnread && variant === 'full' && (
          <span className="notif-item__new" aria-hidden="true">
            {NOTIFICATION_COPY.NEW}
          </span>
        )}
      </button>
    </li>
  );
}
