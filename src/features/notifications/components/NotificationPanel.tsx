import type { Notification } from '@/api';
import { Alert, Button, Loader } from '@/components';
import { NOTIFICATION_COPY } from '@/constants';
import { NotificationItem } from './NotificationItem';
import './NotificationPanel.css';

interface NotificationPanelProps {
  items: readonly Notification[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  isMarkingAll: boolean;
  onRetry: () => void;
  onOpen: (notification: Notification) => void;
  onMarkAllRead: () => void;
  onReadMore: () => void;
}

// The latest few notifications; the full list lives on the notifications page.
export function NotificationPanel({
  items,
  total,
  isLoading,
  isError,
  isMarkingAll,
  onRetry,
  onOpen,
  onMarkAllRead,
  onReadMore,
}: NotificationPanelProps) {
  const hasData = !isLoading && !isError;

  return (
    <div className="notif-panel__inner">
      <div className="notif-panel__head">
        <h2 className="notif-panel__title">{NOTIFICATION_COPY.PANEL_TITLE}</h2>
        <Button variant="secondary" disabled={isMarkingAll} onClick={onMarkAllRead}>
          {NOTIFICATION_COPY.MARK_ALL_READ}
        </Button>
      </div>
      {isLoading && <Loader label={NOTIFICATION_COPY.LOADING} />}
      {isError && (
        <div className="notif-panel__message">
          <Alert>{NOTIFICATION_COPY.LOAD_ERROR}</Alert>
          <Button variant="secondary" onClick={onRetry}>
            {NOTIFICATION_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && items.length === 0 && (
        <div className="notif-panel__message notif-panel__message--empty">
          <strong>{NOTIFICATION_COPY.EMPTY_TITLE}</strong>
          <span>{NOTIFICATION_COPY.EMPTY_HINT}</span>
        </div>
      )}
      {hasData && items.length > 0 && (
        <ul className="notif-panel__list">
          {items.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onOpen={onOpen}
              variant="compact"
            />
          ))}
        </ul>
      )}
      <button type="button" className="notif-panel__more" onClick={onReadMore}>
        {NOTIFICATION_COPY.READ_MORE} <span aria-hidden="true">→</span>
        {hasData && (
          <span className="notif-panel__total">{NOTIFICATION_COPY.READ_MORE_TOTAL(total)}</span>
        )}
      </button>
    </div>
  );
}
