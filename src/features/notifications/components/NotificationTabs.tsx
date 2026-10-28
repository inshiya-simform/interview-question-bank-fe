import { NOTIFICATION_COPY, NOTIFICATION_FILTERS } from '@/constants';
import type { NotificationFilter } from '@/constants';
import { cn } from '@/utils/cn';
import { useNotificationTabs } from '../hooks/useNotificationTabs';
import './NotificationTabs.css';

interface NotificationTabsProps {
  active: NotificationFilter;
  // A tab's count is omitted when the API did not report it for the current filter.
  counts: Partial<Record<NotificationFilter, number>>;
  onChange: (filter: NotificationFilter) => void;
}

export function NotificationTabs({ active, counts, onChange }: NotificationTabsProps) {
  const { handleKeyDown } = useNotificationTabs(onChange);

  return (
    <div role="tablist" aria-label={NOTIFICATION_COPY.TABS_LABEL} className="ntabs">
      {NOTIFICATION_FILTERS.map((filter) => (
        <button
          key={filter}
          id={`notification-tab-${filter}`}
          type="button"
          role="tab"
          aria-selected={filter === active}
          aria-controls="notification-tabpanel"
          tabIndex={filter === active ? 0 : -1}
          className={cn('ntabs__tab', filter === active && 'ntabs__tab--active')}
          onClick={() => onChange(filter)}
          onKeyDown={(event) => handleKeyDown(event, filter)}
        >
          {NOTIFICATION_COPY.TAB_LABEL[filter]}
          {counts[filter] !== undefined && <span className="ntabs__count">{counts[filter]}</span>}
        </button>
      ))}
    </div>
  );
}
