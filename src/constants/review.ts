// `details.reason` values the review endpoints report on a 409.
export const REVIEW_CONFLICT_REASON = {
  LOCKED: 'LOCKED',
  ALREADY_REVIEWED: 'ALREADY_REVIEWED',
  EDITED_SINCE_LOADED: 'EDITED_SINCE_LOADED',
} as const;

export type ReviewConflictReason =
  (typeof REVIEW_CONFLICT_REASON)[keyof typeof REVIEW_CONFLICT_REASON];
