import {
  AUDIT_ACTION_LABEL,
  AUDIT_ACTION_TONE,
  AUDIT_MODULE_LABEL,
  REVIEW_STATUS_LABEL,
  ROLE_LABELS,
} from '@/constants';
import type { BadgeVariant } from '@/components';
import type { AuditAction, AuditBadgeTone, AuditModule, ReviewStatus, Role } from '@/constants';

const isIn = <T extends string>(record: Record<T, unknown>, key: string): key is T =>
  Object.hasOwn(record, key);

// "REQUEST_CHANGES" -> "Request changes" for values the API adds after this UI shipped.
export function humanize(value: string): string {
  const words = value.toLowerCase().replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export const getActionLabel = (action: string): string =>
  isIn<AuditAction>(AUDIT_ACTION_LABEL, action) ? AUDIT_ACTION_LABEL[action] : humanize(action);

export const getModuleLabel = (module: string): string =>
  isIn<AuditModule>(AUDIT_MODULE_LABEL, module) ? AUDIT_MODULE_LABEL[module] : humanize(module);

export const getRoleLabel = (role: string): string =>
  isIn<Role>(ROLE_LABELS, role) ? ROLE_LABELS[role] : humanize(role);

export const getActionTone = (action: string): AuditBadgeTone =>
  isIn<AuditAction>(AUDIT_ACTION_LABEL, action)
    ? (AUDIT_ACTION_TONE[action] ?? 'neutral')
    : 'neutral';

export const getStatusLabel = (status: string): string =>
  isIn<ReviewStatus>(REVIEW_STATUS_LABEL, status) ? REVIEW_STATUS_LABEL[status] : humanize(status);

const TONE_VARIANT: Record<AuditBadgeTone, BadgeVariant> = {
  neutral: 'category',
  success: 'success',
  danger: 'danger',
  warning: 'warning',
};

export const getActionBadgeVariant = (action: string): BadgeVariant =>
  TONE_VARIANT[getActionTone(action)];
