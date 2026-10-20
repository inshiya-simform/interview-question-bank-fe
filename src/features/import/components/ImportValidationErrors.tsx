import type { ImportRowError } from '@/api';
import { Button } from '@/components';
import { IMPORT_COPY } from '@/constants';
import { useImportValidationErrors } from '../hooks/useImportValidationErrors';
import { ImportErrorTable } from './ImportErrorTable';
import './ImportStatus.css';

interface ImportValidationErrorsProps {
  message: string;
  details: readonly ImportRowError[];
  onChooseDifferent: () => void;
}

export function ImportValidationErrors({
  message,
  details,
  onChooseDifferent,
}: ImportValidationErrorsProps) {
  const { groups, summary } = useImportValidationErrors(details);

  return (
    <div className="istatus istatus--strong">
      <h2 className="istatus__title">
        <span aria-hidden="true">! </span>
        {IMPORT_COPY.VALIDATION_HEADING}
      </h2>
      {message && <p className="istatus__text">{message}</p>}
      <p className="istatus__text">
        <strong>{summary}</strong>
      </p>
      <ImportErrorTable groups={groups} />
      <div className="istatus__actions">
        <Button onClick={onChooseDifferent}>{IMPORT_COPY.CHOOSE_DIFFERENT}</Button>
      </div>
    </div>
  );
}
