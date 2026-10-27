import type { KeyboardEvent } from 'react';
import { NOTIFICATION_FILTERS } from '@/constants';
import type { NotificationFilter } from '@/constants';

const STEP_BY_KEY: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

// Roving tabindex: arrow keys move between tabs and select them, as the tabs pattern expects.
export function useNotificationTabs(onChange: (filter: NotificationFilter) => void) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, current: NotificationFilter) => {
    const step = STEP_BY_KEY[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const count = NOTIFICATION_FILTERS.length;
    const next =
      NOTIFICATION_FILTERS[(NOTIFICATION_FILTERS.indexOf(current) + step + count) % count];
    if (next === undefined) return;
    onChange(next);
    document.getElementById(`notification-tab-${next}`)?.focus();
  };

  return { handleKeyDown };
}
