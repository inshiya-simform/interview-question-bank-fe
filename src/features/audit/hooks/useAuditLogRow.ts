import { useId } from 'react';
import type { AuditLog } from '@/api';
import { AUDIT_COPY } from '@/constants';
import { useDisclosure } from '@/hooks/useDisclosure';
import { formatDateTime, formatFullDateTime } from '@/utils/date';
import type { TagLookup } from '../changes';
import { buildChangeView } from '../changes';
import { getActionBadgeVariant, getActionLabel, getModuleLabel, getRoleLabel } from '../labels';
import { summarizeAuditLog } from '../summary';

export function useAuditLogRow(log: AuditLog, lookup: TagLookup) {
  const { isOpen, toggle } = useDisclosure();
  const detailsId = useId();
  const view = buildChangeView(log, lookup);
  const hasUser = log.actorId !== null;
  const hasName = hasUser && log.actorName !== null;

  return {
    isOpen,
    toggle,
    detailsId,
    view,
    hasChanges: view.kind !== 'none',
    when: formatDateTime(log.createdAt),
    whenFull: formatFullDateTime(log.createdAt),
    activityLabel: getActionLabel(log.action),
    activityVariant: getActionBadgeVariant(log.action),
    moduleLabel: getModuleLabel(log.module),
    summary: summarizeAuditLog(log),
    actorPrimary: hasName ? log.actorName : log.actorEmail,
    showActorEmail: hasName,
    roleLabel: log.actorRole ? getRoleLabel(log.actorRole) : null,
    isUnknownUser: !hasUser,
    toggleLabel: isOpen ? AUDIT_COPY.HIDE_DETAILS : AUDIT_COPY.SHOW_DETAILS,
  };
}
