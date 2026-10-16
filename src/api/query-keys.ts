import type { ClientAccessListParams } from './type/admin/client-access-list';
import type { QuestionListParams } from './type/questions/questions-list';

// Option lists depend on the viewer's permissions, so keys carry the user id.
export const QUERY_KEYS = {
  AUTH_ME: ['auth', 'me'] as const,
  AUTH_PERMISSIONS: ['auth', 'permissions'] as const,
  QUESTIONS_LIST: ['questions'] as const,
  QUESTIONS: (userId: string, params?: QuestionListParams) =>
    ['questions', userId, params] as const,
  // Shares the 'questions' prefix so list invalidation also refreshes cached items.
  QUESTION_ITEM: (userId: string, id: string) => ['questions', 'item', userId, id] as const,
  DUPLICATE_CHECK: (userId: string, text: string) =>
    ['questions', 'duplicate-check', userId, text] as const,
  CLIENTS: (userId: string) => ['clients', userId] as const,
  TAGS: (userId: string) => ['tags', userId] as const,
  CLIENT_ACCESS_LIST: ['admin', 'client-access'] as const,
  CLIENT_ACCESS: (userId: string, params?: ClientAccessListParams) =>
    ['admin', 'client-access', userId, params] as const,
} as const;
