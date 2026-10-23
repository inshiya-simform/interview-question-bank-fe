import { AUDIT_COPY } from '@/constants';
import type { AuditChangeView } from '../changes';
import { AuditFieldDiff } from './AuditFieldDiff';
import './AuditChanges.css';

interface AuditChangesProps {
  view: AuditChangeView;
}

export function AuditChanges({ view }: AuditChangesProps) {
  switch (view.kind) {
    case 'none':
      return null;
    case 'fields':
      return (
        <div className="audit-changes">
          {view.pendingReview && (
            <p className="audit-changes__pending">{AUDIT_COPY.PENDING_REVIEW}</p>
          )}
          <dl className="audit-changes__list">
            {view.fields.map((field) => (
              <AuditFieldDiff key={field.key} field={field} />
            ))}
          </dl>
        </div>
      );
    case 'details':
      return (
        <div className="audit-changes">
          {view.headline && <p className="audit-changes__headline">{view.headline}</p>}
          <dl className="audit-changes__list">
            {view.entries.map((entry) => (
              <div key={entry.key} className="audit-diff">
                <dt className="audit-diff__label">{entry.label}</dt>
                <dd className="audit-changes__value">{entry.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case 'raw':
      return (
        <details className="audit-changes">
          <summary>{AUDIT_COPY.RAW_SUMMARY}</summary>
          <pre className="audit-changes__json">{view.json}</pre>
        </details>
      );
    default: {
      const unreachable: never = view;
      return unreachable;
    }
  }
}
