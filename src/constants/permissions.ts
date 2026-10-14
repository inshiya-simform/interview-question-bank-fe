export const PERMISSIONS = {
  QUESTION_READ: 'question:read',
  QUESTION_CREATE: 'question:create',
  QUESTION_EDIT_OWN: 'question:edit_own',
  QUESTION_EDIT_ANY: 'question:edit_any',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
