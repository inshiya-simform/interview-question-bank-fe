export const REVIEW_STATUS = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

// Actions the history endpoint is known to report; unknown ones fall back to the raw value.
export const QUESTION_HISTORY_ACTION = {
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  APPROVED: 'APPROVED',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  REJECTED: 'REJECTED',
} as const;

// Tab value for "no status filter" on the My submissions page.
export const ALL_STATUSES = '';

export type StatusTab = ReviewStatus | typeof ALL_STATUSES;

export const QUEUE_TABS: readonly StatusTab[] = [
  REVIEW_STATUS.PENDING_REVIEW,
  REVIEW_STATUS.CHANGES_REQUESTED,
  REVIEW_STATUS.REJECTED,
];

export const SUBMISSION_TABS: readonly StatusTab[] = [
  ALL_STATUSES,
  REVIEW_STATUS.PENDING_REVIEW,
  REVIEW_STATUS.CHANGES_REQUESTED,
  REVIEW_STATUS.REJECTED,
];
