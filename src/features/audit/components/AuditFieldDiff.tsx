import { AUDIT_COPY } from '@/constants';
import type { FieldDiff } from '../changes';

interface AuditFieldDiffProps {
  field: FieldDiff;
}

// Removal uses strikethrough and addition a heavy underline, so neither relies on colour.
export function AuditFieldDiff({ field }: AuditFieldDiffProps) {
  return (
    <div className="audit-diff">
      <dt className="audit-diff__label">{field.label}</dt>
      <dd className="audit-diff__values">
        <del className="audit-diff__from">
          <span className="sr-only">{AUDIT_COPY.FROM_LABEL}: </span>
          {field.from}
        </del>
        <span aria-hidden="true">→</span>
        <ins className="audit-diff__to">
          <span className="sr-only">{AUDIT_COPY.TO_LABEL}: </span>
          {field.to}
        </ins>
      </dd>
    </div>
  );
}
