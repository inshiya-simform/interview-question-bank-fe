export const AUDIT_MODULE = {
  AUTH: 'AUTH',
  USER: 'USER',
  CLIENT: 'CLIENT',
  CLIENT_ACCESS: 'CLIENT_ACCESS',
  QUESTION: 'QUESTION',
} as const;

export const AUDIT_ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  REQUEST_CHANGES: 'REQUEST_CHANGES',
  GRANT_ACCESS: 'GRANT_ACCESS',
  REVOKE_ACCESS: 'REVOKE_ACCESS',
  LOGIN: 'LOGIN',
  LOGIN_FAILED: 'LOGIN_FAILED',
  REGISTER: 'REGISTER',
  PASSWORD_RESET_REQUESTED: 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET: 'PASSWORD_RESET',
  IMPORT: 'IMPORT',
  EXPORT: 'EXPORT',
} as const;

export type AuditModule = (typeof AUDIT_MODULE)[keyof typeof AUDIT_MODULE];
export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];

export const AUDIT_MODULES = Object.values(AUDIT_MODULE);
export const AUDIT_ACTIONS = Object.values(AUDIT_ACTION);

export const AUDIT_MODULE_LABEL: Record<AuditModule, string> = {
  AUTH: 'Authentication',
  USER: 'User',
  CLIENT: 'Client',
  CLIENT_ACCESS: 'Client access',
  QUESTION: 'Question',
};

export const AUDIT_ACTION_LABEL: Record<AuditAction, string> = {
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
  APPROVE: 'Approve',
  REJECT: 'Reject',
  REQUEST_CHANGES: 'Request changes',
  GRANT_ACCESS: 'Grant access',
  REVOKE_ACCESS: 'Revoke access',
  LOGIN: 'Login',
  LOGIN_FAILED: 'Login failed',
  REGISTER: 'Register',
  PASSWORD_RESET_REQUESTED: 'Password reset requested',
  PASSWORD_RESET: 'Password reset',
  IMPORT: 'Import',
  EXPORT: 'Export',
};

export type AuditBadgeTone = 'neutral' | 'success' | 'danger' | 'warning';

// Actions not listed here use the neutral tone.
export const AUDIT_ACTION_TONE: Partial<Record<AuditAction, AuditBadgeTone>> = {
  APPROVE: 'success',
  REJECT: 'danger',
  LOGIN_FAILED: 'danger',
  REQUEST_CHANGES: 'warning',
};

// Fields of a QUESTION update, in display order.
export const AUDIT_FIELD_LABEL: Record<string, string> = {
  text: 'Question text',
  answerNotes: 'Answer notes',
  clientId: 'Client',
  tags: 'Tags',
};

export const AUDIT_KEY_LABEL: Record<string, string> = {
  ...AUDIT_FIELD_LABEL,
  name: 'Name',
  email: 'Email',
  role: 'Role',
  userId: 'User ID',
  count: 'Count',
  questionIds: 'Question IDs',
  filters: 'Filters',
  duplicateOverride: 'Duplicate override',
  reason: 'Reason',
  note: 'Note',
  fromStatus: 'From status',
  toStatus: 'To status',
  appliedDraft: 'Draft applied',
  discardedDraft: 'Draft discarded',
};

export const AUDIT_COPY = {
  NAV: 'Audit logs',
  TITLE: 'Audit logs',
  SUBTITLE: 'A read-only record of who did what across the question bank.',
  LIST_LABEL: 'Audit log entries',
  FILTERS_LABEL: 'Filter audit logs',
  FIELD_MODULE: 'Module',
  PLACEHOLDER_MODULE: 'All modules',
  FIELD_ACTION: 'Action',
  PLACEHOLDER_ACTION: 'All actions',
  FIELD_ACTOR: 'Performed by',
  PLACEHOLDER_ACTOR: 'Search by actor email',
  FIELD_FROM: 'From',
  FIELD_TO: 'To',
  CLEAR_FILTERS: 'Clear filters',
  COLUMN_WHEN: 'When',
  COLUMN_ACTIVITY: 'Activity',
  COLUMN_MODULE: 'Module',
  COLUMN_ACTOR: 'Performed by',
  COLUMN_DETAILS: 'Details',
  UNKNOWN_USER: 'Unknown user',
  NO_VALUE: '—',
  EMPTY_VALUE: '(empty)',
  EMPTY: 'No activity found',
  LOADING: 'Loading audit logs',
  LOAD_ERROR: 'Could not load audit logs.',
  RETRY: 'Try again',
  PAGINATION_LABEL: 'Audit logs pagination',
  PREVIOUS_PAGE: 'Previous',
  NEXT_PAGE: 'Next',
  PAGE_NUMBER: (page: number) => `Page ${page}`,
  PAGE_STATUS: (page: number, totalPages: number) => `Page ${page} of ${totalPages}`,
  ENTRY_COUNT: (count: number) => `${count} ${count === 1 ? 'entry' : 'entries'} found`,
  SHOW_DETAILS: 'Show changes',
  HIDE_DETAILS: 'Hide changes',
  DETAILS_FOR: (activity: string) => `Changes for ${activity}`,
  YES: 'Yes',
  PENDING_REVIEW: 'Pending review',
  DUPLICATE_OVERRIDE_REASON: 'Duplicate override reason',
  FROM_LABEL: 'Before',
  TO_LABEL: 'After',
  STATUS_CHANGE: (from: string, to: string) => `Status ${from} → ${to}`,
  RAW_SUMMARY: 'Raw data',
  CHANGES_RECORDED: 'Changes recorded',
  FIELD_CHANGED: (fields: string) => `${fields} changed`,
  QUESTION_CREATED: 'Question created',
  CLIENT_CREATED: (name: string) => `Client "${name}" created`,
  USER_CREATED: (email: string) => `User ${email} created`,
  GRANTED: (email: string) => `Granted access to ${email}`,
  REVOKED: (userId: string) => `Revoked access for user ${userId}`,
  IMPORTED: (count: number) => `${count} ${count === 1 ? 'question' : 'questions'} imported`,
  EXPORTED: (count: number) => `${count} ${count === 1 ? 'question' : 'questions'} exported`,
  REGISTERED: (email: string) => `Registered ${email}`,
  TAG_FALLBACK: (id: number) => `Tag #${id}`,
  CATEGORY_FALLBACK: (id: number) => `Category #${id}`,
} as const;

export const AUDIT_JSON_INDENT = 2;
