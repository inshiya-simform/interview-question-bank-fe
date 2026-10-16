export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  USER: 'USER',
  AUTHOR: 'AUTHOR',
  REVIEWER: 'REVIEWER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// The only roles a super admin may assign when adding people.
export const STAFF_ROLES = [ROLES.AUTHOR, ROLES.REVIEWER] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];
