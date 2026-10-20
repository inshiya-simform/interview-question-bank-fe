import { useId } from 'react';
import { IMPORT_COPY } from '@/constants';
import './ImportDuplicateHint.css';

export function ImportDuplicateHint() {
  const tooltipId = useId();

  return (
    <span className="ihint">
      <button
        type="button"
        className="ihint__trigger"
        aria-label={IMPORT_COPY.DUPLICATE_HELP_LABEL}
        aria-describedby={tooltipId}
      >
        <span aria-hidden="true">?</span>
      </button>
      <span id={tooltipId} role="tooltip" className="ihint__tooltip">
        {IMPORT_COPY.DUPLICATE_HELP}
      </span>
    </span>
  );
}
