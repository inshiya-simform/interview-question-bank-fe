export const MEMBER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type MemberStatus = (typeof MEMBER_STATUS)[keyof typeof MEMBER_STATUS];

export const MEMBER_STATUSES = [MEMBER_STATUS.ACTIVE, MEMBER_STATUS.INACTIVE] as const;
