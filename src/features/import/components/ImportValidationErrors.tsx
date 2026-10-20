import type { ImportRowError } from '@/api';
import { Button } from '@/components';
import { IMPORT_COPY } from '@/constants';
import { useImportValidationErrors } from '../hooks/useImportValidationErrors';
import { ImportErrorTable } from './ImportErrorTable';
import './ImportStatus.css';

interface ImportValidationErrorsProps {
  details: readonly ImportRowError[];
  onChooseDifferent: () => void;
}

export function ImportValidationErrors({
  details,
  onChooseDifferent,
}: ImportValidationErrorsProps) {
  const { groups, summary, downloadErrors } = useImportValidationErrors(details);

  return (
    <div className="istatus istatus--strong">
      <h2 className="istatus__title">
        <span aria-hidden="true">! </span>
        {IMPORT_COPY.VALIDATION_HEADING}
      </h2>
      <p className="istatus__text">
        <strong>{summary}</strong>
      </p>
      <ImportErrorTable groups={groups} />
      <div className="istatus__actions">
        <Button onClick={onChooseDifferent}>{IMPORT_COPY.CHOOSE_DIFFERENT}</Button>
        <Button variant="secondary" onClick={downloadErrors}>
          {IMPORT_COPY.DOWNLOAD_ERRORS}
        </Button>
      </div>
    </div>
  );
}
