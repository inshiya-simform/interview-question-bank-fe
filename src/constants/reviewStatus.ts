export const REVIEW_STATUS = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

// Whether a submission is a brand-new question or an edit of a live one.
export const REVIEW_KIND = {
  NEW: 'NEW',
  EDIT: 'EDIT',
} as const;

export type ReviewKind = (typeof REVIEW_KIND)[keyof typeof REVIEW_KIND];

export const REVIEW_HISTORY_EVENT = {
  SUBMITTED: 'SUBMITTED',
  EDITED: 'EDITED',
  APPROVED: 'APPROVED',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  REJECTED: 'REJECTED',
} as const;

export type ReviewHistoryEvent = (typeof REVIEW_HISTORY_EVENT)[keyof typeof REVIEW_HISTORY_EVENT];

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
