import { IMPORT_COPY } from '@/constants';
import { useImportFlow } from '../hooks/useImportFlow';
import { ImportDropzone } from './ImportDropzone';
import { ImportFailureBanner } from './ImportFailureBanner';
import { ImportFileRow } from './ImportFileRow';
import { ImportInstructions } from './ImportInstructions';
import { ImportPreviewSwitcher } from './ImportPreviewSwitcher';
import { ImportSuccessPanel } from './ImportSuccessPanel';
import { ImportUploading } from './ImportUploading';
import { ImportValidationErrors } from './ImportValidationErrors';
import './ImportScreen.css';

export function ImportScreen() {
  const flow = useImportFlow();
  const { phase, file, clientError, success, failure } = flow;
  const isUploading = phase === 'uploading';

  return (
    <div className="iscreen">
      <div>
        <h1>{IMPORT_COPY.TITLE}</h1>
        <p className="iscreen__subtitle">{IMPORT_COPY.SUBTITLE}</p>
      </div>
      <ImportPreviewSwitcher value={flow.preview} onChange={flow.setPreview} />
      <p className="sr-only" role="status" aria-live="polite">
        {flow.announcement}
      </p>
      <ImportInstructions />
      {flow.view === 'success' && success && (
        <ImportSuccessPanel result={success} onImportAnother={flow.reset} />
      )}
      {flow.view === 'validation' && (
        <ImportValidationErrors details={flow.validationDetails} onChooseDifferent={flow.reset} />
      )}
      {flow.view === 'form' && (
        <>
          <ImportDropzone disabled={isUploading} onFiles={flow.selectFiles} />
          {(file || clientError) && (
            <ImportFileRow
              file={file}
              clientError={clientError}
              canImport={flow.canImport}
              isBusy={isUploading}
              onRemove={flow.reset}
              onImport={flow.startImport}
            />
          )}
          {isUploading && <ImportUploading />}
          {failure && <ImportFailureBanner failure={failure} onRetry={flow.startImport} />}
          <p className="iscreen__notice">{IMPORT_COPY.REVIEW_NOTICE}</p>
        </>
      )}
    </div>
  );
}
