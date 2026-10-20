export const QUESTION_SEARCH_PARAMS = {
  PAGE: 'page',
  SEARCH: 'q',
  CLIENT: 'client',
  CATEGORIES: 'categories',
  TAGS: 'tags',
} as const;

export const REVIEW_SEARCH_PARAMS = {
  PAGE: 'page',
  STATUS: 'status',
} as const;

export const ADMIN_SEARCH_PARAMS = {
  PAGE: 'page',
  SEARCH: 'q',
} as const;

export const MEMBER_SEARCH_PARAMS = {
  PAGE: 'page',
  SEARCH: 'q',
  ROLE: 'role',
} as const;

export const CSV_SEPARATOR = ',';
