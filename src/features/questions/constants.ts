export const NOTICE = {
  NEW: 'new',
  LIVE_EDIT: 'live-edit',
  CHANGES: 'changes',
} as const;

export type Notice = (typeof NOTICE)[keyof typeof NOTICE];
