import { Icon, Popover } from '@/components';
import { NOTIFICATION_COPY } from '@/constants';
import { useNotificationBell } from '../hooks/useNotificationBell';
import { NotificationPanel } from './NotificationPanel';
import './NotificationBell.css';

// Sits in the sidebar nav and opens the latest notifications beside it.
export function NotificationBell() {
  const bell = useNotificationBell();

  return (
    <Popover
      isOpen={bell.isOpen}
      onClose={bell.close}
      label={NOTIFICATION_COPY.PANEL_TITLE}
      placement="beside"
      className="notif-bell"
      panelClassName="notif-panel"
      trigger={
        <button
          type="button"
          className="sidebar__link sidebar__link--button"
          aria-label={bell.label}
          aria-haspopup="dialog"
          aria-expanded={bell.isOpen}
          onClick={bell.toggle}
        >
          <Icon name="bell" />
          <span className="sidebar__label">{NOTIFICATION_COPY.NAV}</span>
          {bell.unreadCount > 0 && (
            <span className="sidebar__count" aria-hidden="true">
              {bell.badge}
            </span>
          )}
        </button>
      }
    >
      <NotificationPanel
        items={bell.items}
        total={bell.total}
        isLoading={bell.isLoading}
        isError={bell.isError}
        isMarkingAll={bell.isMarkingAll}
        onRetry={bell.refetch}
        onOpen={bell.openNotification}
        onMarkAllRead={bell.markAllRead}
        onReadMore={bell.readMore}
      />
    </Popover>
  );
}
