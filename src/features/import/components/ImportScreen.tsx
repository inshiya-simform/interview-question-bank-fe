import { PageHeader } from '@/components';
import { IMPORT_COPY } from '@/constants';
import { useImportFlow } from '../hooks/useImportFlow';
import { ImportDropzone } from './ImportDropzone';
import { ImportFailureBanner } from './ImportFailureBanner';
import { ImportFileRow } from './ImportFileRow';
import { ImportInstructions } from './ImportInstructions';
import { ImportSuccessPanel } from './ImportSuccessPanel';
import { ImportUploading } from './ImportUploading';
import { ImportValidationErrors } from './ImportValidationErrors';
import './ImportScreen.css';

export function ImportScreen() {
  const flow = useImportFlow();
  const { file, clientError, success, failureMessage, isUploading } = flow;

  return (
    <div className="iscreen">
      <PageHeader title={IMPORT_COPY.TITLE} subtitle={IMPORT_COPY.SUBTITLE} />
      <p className="sr-only" role="status" aria-live="polite">
        {flow.announcement}
      </p>
      <ImportInstructions />
      {flow.view === 'success' && success && (
        <ImportSuccessPanel result={success} onImportAnother={flow.reset} />
      )}
      {flow.view === 'validation' && (
        <ImportValidationErrors
          message={flow.validationMessage}
          details={flow.validationDetails}
          onChooseDifferent={flow.reset}
        />
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
          {failureMessage && (
            <ImportFailureBanner message={failureMessage} onRetry={flow.startImport} />
          )}
          <p className="iscreen__notice">{IMPORT_COPY.REVIEW_NOTICE}</p>
        </>
      )}
    </div>
  );
}
