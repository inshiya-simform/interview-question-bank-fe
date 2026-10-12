export const ROLES = {
  USER: 'USER',
  AUTHOR: 'AUTHOR',
  REVIEWER: 'REVIEWER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
