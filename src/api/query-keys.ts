import type { CommentSort } from '@/constants';
import type { AdminUsersParams } from './type/admin/users-list';
import type { AuditLogListParams } from './type/admin/audit-logs';
import type { ClientAccessListParams } from './type/admin/client-access-list';
import type { SavedQuestionListParams } from './type/collections/saved-questions';
import type { NotificationListParams } from './type/notifications/notifications-list';
import type { CheckDuplicatePayload } from './type/questions/check-duplicate';
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
  DUPLICATE_CHECK: (userId: string, payload: CheckDuplicatePayload) =>
    ['questions', 'duplicate-check', userId, payload] as const,
  SUBMISSIONS: (userId: string, params?: SubmissionListParams) =>
    ['questions', 'submissions', userId, params] as const,
  QUESTION_COUNTS: (userId: string) => ['questions', 'counts', userId] as const,
  QUESTION_HISTORY: (userId: string, id: string) => ['questions', 'history', userId, id] as const,
  REVIEW_STATE: (userId: string, id: string) => ['questions', 'review-state', userId, id] as const,
  // Both collection keys share the 'collections' prefix; the saved list has its own sub-prefix so
  // it can be invalidated without refetching a view that is about to disappear.
  COLLECTIONS_LIST: ['collections'] as const,
  COLLECTION_LIST: ['collections', 'list'] as const,
  COLLECTIONS: (userId: string) => ['collections', 'list', userId] as const,
  SAVED_QUESTIONS_LIST: ['collections', 'saved-questions'] as const,
  SAVED_QUESTIONS: (userId: string, params?: SavedQuestionListParams) =>
    ['collections', 'saved-questions', userId, params] as const,
  NOTIFICATIONS_LIST: ['notifications'] as const,
  NOTIFICATIONS: (userId: string, params?: NotificationListParams) =>
    ['notifications', 'list', userId, params] as const,
  // Prefix of every cached list page for one user, for cache updates from the stream.
  NOTIFICATION_LISTS: (userId: string) => ['notifications', 'list', userId] as const,
  NOTIFICATIONS_UNREAD_COUNT: (userId: string) =>
    ['notifications', 'unread-count', userId] as const,
  // Infinite list of threads; every page of one sort shares this key.
  COMMENTS_LIST: ['comments'] as const,
  COMMENTS: (userId: string, questionId: string, sort: CommentSort) =>
    ['comments', userId, questionId, sort] as const,
  // Replies loaded beyond a thread's preview; one infinite query per thread.
  REPLIES_LIST: ['comment-replies'] as const,
  REPLIES: (userId: string, questionId: string, commentId: string) =>
    ['comment-replies', userId, questionId, commentId] as const,
  MENTIONABLE_USERS: (userId: string, questionId: string, search: string) =>
    ['mentionable-users', userId, questionId, search] as const,
  RELATED_QUESTIONS: (userId: string, questionId: string) =>
    ['related-questions', userId, questionId] as const,
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
