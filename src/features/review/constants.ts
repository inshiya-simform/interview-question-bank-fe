export const DECISION_MODE = {
  CHANGES: 'changes',
  REJECT: 'reject',
} as const;

export type DecisionMode = (typeof DECISION_MODE)[keyof typeof DECISION_MODE];

// Matches shown before "Show more"; an author can confirm against many similar questions.
export const DUPLICATE_OVERRIDE_PREVIEW_COUNT = 3;
