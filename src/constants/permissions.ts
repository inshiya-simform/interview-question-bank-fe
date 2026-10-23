export const PERMISSIONS = {
  QUESTION_READ: 'question:read',
  QUESTION_CREATE: 'question:create',
  QUESTION_EDIT_OWN: 'question:edit_own',
  QUESTION_EDIT_ANY: 'question:edit_any',
  QUESTION_REVIEW: 'question:review',
  USER_READ: 'user:read',
  USER_CREATE_STAFF: 'user:create_staff',
  CLIENT_READ_ALL: 'client:read_all',
  CLIENT_ASSIGN: 'client:assign',
  AUDIT_READ: 'audit:read',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Holding any of these means the user belongs in the super admin area.
export const SUPER_ADMIN_PERMISSIONS: readonly Permission[] = [
  PERMISSIONS.USER_READ,
  PERMISSIONS.USER_CREATE_STAFF,
  PERMISSIONS.CLIENT_READ_ALL,
  PERMISSIONS.CLIENT_ASSIGN,
];
