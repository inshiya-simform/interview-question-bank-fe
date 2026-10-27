export const QUESTION_SEARCH_PARAMS = {
  PAGE: 'page',
  SEARCH: 'q',
  CLIENT: 'client',
  CATEGORIES: 'categories',
  TAGS: 'tags',
} as const;

export const SAVED_SEARCH_PARAMS = {
  PAGE: 'page',
  COLLECTION: 'collection',
} as const;

export const REVIEW_SEARCH_PARAMS = {
  PAGE: 'page',
  STATUS: 'status',
} as const;

export const NOTIFICATION_SEARCH_PARAMS = {
  PAGE: 'page',
  FILTER: 'filter',
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

export const AUDIT_SEARCH_PARAMS = {
  PAGE: 'page',
  MODULE: 'module',
  ACTION: 'action',
  SEARCH: 'q',
  FROM: 'from',
  TO: 'to',
} as const;

export const RESET_PASSWORD_SEARCH_PARAMS = {
  TOKEN: 'token',
} as const;

export const CSV_SEPARATOR = ',';
