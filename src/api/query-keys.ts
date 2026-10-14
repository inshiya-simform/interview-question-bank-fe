import type { QuestionListParams } from './type/questions/questions-list';

// Option lists depend on the viewer's permissions, so keys carry the user id.
export const QUERY_KEYS = {
  AUTH_ME: ['auth', 'me'] as const,
  QUESTIONS_LIST: ['questions'] as const,
  QUESTIONS: (userId: string, params?: QuestionListParams) =>
    ['questions', userId, params] as const,
  CLIENTS: (userId: string) => ['clients', userId] as const,
  TAGS: (userId: string) => ['tags', userId] as const,
} as const;
