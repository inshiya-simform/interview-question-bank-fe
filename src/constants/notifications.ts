export const NOTIFICATION_TYPE = {
  QUESTION_APPROVED: 'QUESTION_APPROVED',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  QUESTION_REJECTED: 'QUESTION_REJECTED',
  NEW_CLIENT_QUESTION: 'NEW_CLIENT_QUESTION',
  IMPORT_FINISHED: 'IMPORT_FINISHED',
  PERMISSION_GRANTED: 'PERMISSION_GRANTED',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export const NOTIFICATION_FILTER = {
  ALL: 'all',
  UNREAD: 'unread',
} as const;

export type NotificationFilter = (typeof NOTIFICATION_FILTER)[keyof typeof NOTIFICATION_FILTER];

export const NOTIFICATION_FILTERS = [NOTIFICATION_FILTER.ALL, NOTIFICATION_FILTER.UNREAD] as const;

export const NOTIFICATION_PREVIEW_COUNT = 5;
export const NOTIFICATIONS_PAGE_SIZE = 10;
// Largest number shown on the badge before it collapses to "N+".
export const NOTIFICATION_BADGE_MAX = 9;
// Simulated network delay for the mock service, until the API exists.
export const NOTIFICATION_MOCK_DELAY_MS = 250;
