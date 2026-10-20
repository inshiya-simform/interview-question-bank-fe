import { Button } from '@/components';
import { IMPORT_COPY, type ImportClientError } from '@/constants';
import { formatFileSize } from '@/utils/fileSize';
import type { SelectedFile } from '../utils';
import './ImportFileRow.css';

interface ImportFileRowProps {
  file: SelectedFile | null;
  clientError: ImportClientError | null;
  canImport: boolean;
  isBusy: boolean;
  onRemove: () => void;
  onImport: () => void;
}

export function ImportFileRow({
  file,
  clientError,
  canImport,
  isBusy,
  onRemove,
  onImport,
}: ImportFileRowProps) {
  const name = file?.name ?? IMPORT_COPY.MULTIPLE_FILES_NAME;

  return (
    <div className={clientError ? 'frow frow--error' : 'frow'}>
      <div className="frow__main">
        <div className="frow__info" role="group" aria-label={IMPORT_COPY.SELECTED_FILE}>
          <span className="frow__name">{name}</span>
          {file && <span className="frow__size">{formatFileSize(file.size)}</span>}
        </div>
        <div className="frow__actions">
          <Button
            variant="secondary"
            disabled={isBusy}
            aria-label={IMPORT_COPY.REMOVE_FILE(name)}
            onClick={onRemove}
          >
            {IMPORT_COPY.REMOVE}
          </Button>
          <Button disabled={!canImport} isLoading={isBusy} onClick={onImport}>
            {IMPORT_COPY.IMPORT}
          </Button>
        </div>
      </div>
      {clientError && (
        <p className="frow__error" role="alert">
          <strong>{IMPORT_COPY.ERROR_PREFIX}</strong> {IMPORT_COPY.CLIENT_ERRORS[clientError]}
        </p>
      )}
    </div>
  );
}
