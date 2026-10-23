import type { AuditLog } from '@/api';
import { AUDIT_ACTION, AUDIT_COPY, AUDIT_FIELD_LABEL, AUDIT_MODULE } from '@/constants';
import { isRecord } from '@/utils/isRecord';
import { getStatusLabel, humanize } from './labels';

type AuditLogLike = Pick<AuditLog, 'action' | 'module' | 'changes'>;

const STATUS_ACTIONS: readonly string[] = [
  AUDIT_ACTION.APPROVE,
  AUDIT_ACTION.REJECT,
  AUDIT_ACTION.REQUEST_CHANGES,
];

const isFieldDiff = (value: unknown): boolean =>
  isRecord(value) && 'from' in value && 'to' in value;

export function getChangedFields(changes: Record<string, unknown>): string[] {
  return Object.keys(changes).filter((key) => isFieldDiff(changes[key]));
}

function summarizeUpdate(changes: Record<string, unknown>): string {
  const fields = getChangedFields(changes);
  if (fields.length === 0) return AUDIT_COPY.CHANGES_RECORDED;
  const labels = fields.map((field) => AUDIT_FIELD_LABEL[field] ?? humanize(field)).join(', ');
  const summary = AUDIT_COPY.FIELD_CHANGED(labels);
  return changes.pendingReview === true ? `${summary} · ${AUDIT_COPY.PENDING_REVIEW}` : summary;
}

// One line for the Details column; the full change set is shown in the expanded row.
export function summarizeAuditLog({ action, module, changes }: AuditLogLike): string {
  if (changes === null || changes === undefined) return AUDIT_COPY.NO_VALUE;
  if (!isRecord(changes)) return AUDIT_COPY.CHANGES_RECORDED;

  const { name, email, userId, count, fromStatus, toStatus } = changes;

  if (module === AUDIT_MODULE.QUESTION && action === AUDIT_ACTION.UPDATE) {
    return summarizeUpdate(changes);
  }
  if (module === AUDIT_MODULE.QUESTION && action === AUDIT_ACTION.CREATE) {
    return AUDIT_COPY.QUESTION_CREATED;
  }
  if (
    STATUS_ACTIONS.includes(action) &&
    typeof fromStatus === 'string' &&
    typeof toStatus === 'string'
  ) {
    return AUDIT_COPY.STATUS_CHANGE(getStatusLabel(fromStatus), getStatusLabel(toStatus));
  }
  if (
    module === AUDIT_MODULE.CLIENT &&
    action === AUDIT_ACTION.CREATE &&
    typeof name === 'string'
  ) {
    return AUDIT_COPY.CLIENT_CREATED(name);
  }
  if (module === AUDIT_MODULE.USER && action === AUDIT_ACTION.CREATE && typeof email === 'string') {
    return AUDIT_COPY.USER_CREATED(email);
  }
  if (action === AUDIT_ACTION.GRANT_ACCESS && typeof email === 'string') {
    return AUDIT_COPY.GRANTED(email);
  }
  if (action === AUDIT_ACTION.REVOKE_ACCESS && typeof userId === 'string') {
    return AUDIT_COPY.REVOKED(userId);
  }
  if (action === AUDIT_ACTION.IMPORT && typeof count === 'number') {
    return AUDIT_COPY.IMPORTED(count);
  }
  if (action === AUDIT_ACTION.EXPORT && typeof count === 'number') {
    return AUDIT_COPY.EXPORTED(count);
  }
  if (action === AUDIT_ACTION.REGISTER && typeof email === 'string') {
    return AUDIT_COPY.REGISTERED(email);
  }
  return AUDIT_COPY.CHANGES_RECORDED;
}
