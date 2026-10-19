export const DECISION_MODE = {
  CHANGES: 'changes',
  REJECT: 'reject',
} as const;

export type DecisionMode = (typeof DECISION_MODE)[keyof typeof DECISION_MODE];
