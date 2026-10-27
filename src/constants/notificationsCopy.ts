import { NOTIFICATION_FILTER } from './notifications';
import type { NotificationFilter } from './notifications';

export const NOTIFICATION_COPY = {
  NAV: 'Notifications',
  NAV_COUNT: (count: number) => `Notifications, ${count} unread`,
  NAV_NONE_UNREAD: 'Notifications, none unread',
  BADGE_OVERFLOW: (max: number) => `${max}+`,
  PANEL_TITLE: 'Notifications',
  MARK_ALL_READ: 'Mark all as read',
  READ_MORE: 'Read more',
  READ_MORE_TOTAL: (total: number) => `(${total} total)`,
  PAGE_TITLE: 'Notifications',
  PAGE_SUBTITLE: 'Every notification sent to you, newest first.',
  TABS_LABEL: 'Filter notifications',
  TAB_LABEL: {
    [NOTIFICATION_FILTER.ALL]: 'All',
    [NOTIFICATION_FILTER.UNREAD]: 'Unread',
  } satisfies Record<NotificationFilter, string>,
  RESULT_COUNT: (shown: number, total: number) =>
    `Showing ${shown} of ${total} ${total === 1 ? 'notification' : 'notifications'}`,
  UNREAD_PREFIX: 'Unread: ',
  READ_PREFIX: 'Read: ',
  NEW: 'New',
  LOADING: 'Loading notifications',
  LOAD_ERROR: 'We couldn’t load your notifications. Please try again.',
  RETRY: 'Try again',
  EMPTY_TITLE: 'No notifications yet',
  EMPTY_HINT: 'When something needs your attention, it will show up here.',
  EMPTY_UNREAD: 'You’re all caught up.',
  PAGINATION_LABEL: 'Notifications pagination',
  PREVIOUS_PAGE: 'Previous',
  NEXT_PAGE: 'Next',
  PAGE_NUMBER: (page: number) => `Page ${page}`,
  PAGE_STATUS: (page: number, totalPages: number) => `Page ${page} of ${totalPages}`,
} as const;
