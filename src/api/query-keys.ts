import type { AdminUsersParams } from './type/admin/users-list';
import type { AuditLogListParams } from './type/admin/audit-logs';
import type { ClientAccessListParams } from './type/admin/client-access-list';
import type { QuestionListParams } from './type/questions/questions-list';
import type { SubmissionListParams } from './type/reviews/submission-list';

// Option lists depend on the viewer's permissions, so keys carry the user id.
export const QUERY_KEYS = {
  AUTH_ME: ['auth', 'me'] as const,
  AUTH_PERMISSIONS: ['auth', 'permissions'] as const,
  RESET_TOKEN_VERIFY: (token: string) => ['auth', 'reset-token', token] as const,
  QUESTIONS_LIST: ['questions'] as const,
  QUESTIONS: (userId: string, params?: QuestionListParams) =>
    ['questions', userId, params] as const,
  // Shares the 'questions' prefix so list invalidation also refreshes cached items.
  QUESTION_ITEM: (userId: string, id: string) => ['questions', 'item', userId, id] as const,
  DUPLICATE_CHECK: (userId: string, text: string) =>
    ['questions', 'duplicate-check', userId, text] as const,
  SUBMISSIONS: (userId: string, params?: SubmissionListParams) =>
    ['questions', 'submissions', userId, params] as const,
  QUESTION_COUNTS: (userId: string) => ['questions', 'counts', userId] as const,
  QUESTION_HISTORY: (userId: string, id: string) => ['questions', 'history', userId, id] as const,
  REVIEW_STATE: (userId: string, id: string) => ['questions', 'review-state', userId, id] as const,
  CLIENTS: (userId: string) => ['clients', userId] as const,
  TAGS: (userId: string) => ['tags', userId] as const,
  ADMIN_USERS_LIST: ['admin', 'users'] as const,
  ADMIN_USERS: (userId: string, search: string) => ['admin', 'users', userId, search] as const,
  ADMIN_USERS_TABLE: (userId: string, params?: AdminUsersParams) =>
    ['admin', 'users', 'table', userId, params] as const,
  AUDIT_LOGS: (userId: string, params?: AuditLogListParams) =>
    ['admin', 'audit-logs', userId, params] as const,
  CLIENT_ACCESS_LIST: ['admin', 'client-access'] as const,
  CLIENT_ACCESS: (userId: string, params?: ClientAccessListParams) =>
    ['admin', 'client-access', userId, params] as const,
} as const;
