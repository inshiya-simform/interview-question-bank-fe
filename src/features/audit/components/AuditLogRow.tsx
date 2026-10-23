import type { AuditLog } from '@/api';
import { Badge, Button } from '@/components';
import { AUDIT_COPY } from '@/constants';
import type { TagLookup } from '../changes';
import { useAuditLogRow } from '../hooks/useAuditLogRow';
import { AuditChanges } from './AuditChanges';

interface AuditLogRowProps {
  log: AuditLog;
  lookup: TagLookup;
}

const COLUMN_COUNT = 5;

export function AuditLogRow({ log, lookup }: AuditLogRowProps) {
  const row = useAuditLogRow(log, lookup);

  return (
    <>
      <tr>
        <td className="audit__when">
          <time dateTime={log.createdAt} title={row.whenFull}>
            {row.when}
          </time>
        </td>
        <td>
          <Badge variant={row.activityVariant}>{row.activityLabel}</Badge>
        </td>
        <td>{row.moduleLabel}</td>
        <td>
          <div className="audit__actor">
            <span className="audit__actor-name">{row.actorPrimary}</span>
            {row.showActorEmail && <span className="audit__actor-email">{log.actorEmail}</span>}
            {row.roleLabel && <Badge variant="category">{row.roleLabel}</Badge>}
            {row.isUnknownUser && <span className="audit__hint">{AUDIT_COPY.UNKNOWN_USER}</span>}
          </div>
        </td>
        <td>
          <div className="audit__details">
            <span className="audit__summary">{row.summary}</span>
            {row.hasChanges && (
              <Button
                variant="secondary"
                aria-expanded={row.isOpen}
                aria-controls={row.detailsId}
                onClick={row.toggle}
              >
                {row.toggleLabel}
              </Button>
            )}
          </div>
        </td>
      </tr>
      {row.isOpen && (
        <tr id={row.detailsId} className="audit__expanded">
          <td colSpan={COLUMN_COUNT}>
            <AuditChanges view={row.view} />
          </td>
        </tr>
      )}
    </>
  );
}
