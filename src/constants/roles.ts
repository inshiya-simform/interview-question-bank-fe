export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  USER: 'USER',
  REVIEWER: 'REVIEWER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// The only roles a super admin may assign when adding people.
export const STAFF_ROLES = [ROLES.REVIEWER] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

// Roles the members list can be filtered by (super admins are never listed).
export const MEMBER_LIST_ROLES = [ROLES.REVIEWER, ROLES.USER] as const;

export type MemberListRole = (typeof MEMBER_LIST_ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: 'Super admin',
  [ROLES.USER]: 'User',
  [ROLES.REVIEWER]: 'Reviewer',
};
