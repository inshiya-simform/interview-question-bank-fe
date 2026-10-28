export const NOTIFICATION_TYPE = {
  CLIENT_ACCESS_GRANTED: 'CLIENT_ACCESS_GRANTED',
  CLIENT_ACCESS_REVOKED: 'CLIENT_ACCESS_REVOKED',
  QUESTION_APPROVED: 'QUESTION_APPROVED',
  QUESTION_CHANGES_REQUESTED: 'QUESTION_CHANGES_REQUESTED',
  QUESTION_REJECTED: 'QUESTION_REJECTED',
  QUESTION_SUBMITTED: 'QUESTION_SUBMITTED',
  CLIENT_QUESTION_ADDED: 'CLIENT_QUESTION_ADDED',
  IMPORT_FINISHED: 'IMPORT_FINISHED',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export const SUBMISSION_REASON = {
  SUBMITTED: 'submitted',
  RESUBMITTED: 'resubmitted',
  EDITED: 'edited',
} as const;

// Types that raise a toast when they arrive live; submissions and client additions are
// high-volume for reviewers/clients and only update the bell.
export const TOASTED_NOTIFICATION_TYPES: readonly NotificationType[] = [
  NOTIFICATION_TYPE.CLIENT_ACCESS_GRANTED,
  NOTIFICATION_TYPE.CLIENT_ACCESS_REVOKED,
  NOTIFICATION_TYPE.QUESTION_APPROVED,
  NOTIFICATION_TYPE.QUESTION_CHANGES_REQUESTED,
  NOTIFICATION_TYPE.QUESTION_REJECTED,
];

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

// Reconnect backoff for the live stream: exponential, capped.
export const NOTIFICATION_STREAM_BACKOFF = {
  INITIAL_MS: 1_000,
  MAX_MS: 30_000,
  FACTOR: 2,
} as const;

// The stream is closed by the server whenever the access token expires, so reconnecting is routine.
export const NOTIFICATION_STREAM_RECONNECT_MS = 250;

export const NOTIFICATION_STREAM_EVENT = {
  READY: 'ready',
  NOTIFICATION: 'notification',
} as const;
