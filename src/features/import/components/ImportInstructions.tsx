import { Button } from '@/components';
import { IMPORT_COPY } from '@/constants';
import { useImportInstructions } from '../hooks/useImportInstructions';
import { ImportColumnReference } from './ImportColumnReference';
import { ImportTagsPanel } from './ImportTagsPanel';
import './ImportInstructions.css';

export function ImportInstructions() {
  const { exampleCsv, downloadTemplate } = useImportInstructions();

  return (
    <section className="iinfo" aria-labelledby="import-instructions-title">
      <div className="iinfo__head">
        <h2 id="import-instructions-title" className="iinfo__title">
          {IMPORT_COPY.INSTRUCTIONS_TITLE}
        </h2>
        <Button variant="secondary" onClick={downloadTemplate}>
          {IMPORT_COPY.DOWNLOAD_TEMPLATE}
        </Button>
      </div>
      <ul className="iinfo__limits" aria-label={IMPORT_COPY.LIMITS_LABEL}>
        <li>{IMPORT_COPY.LIMIT_FORMAT}</li>
        <li>{IMPORT_COPY.LIMIT_SIZE}</li>
        <li>{IMPORT_COPY.LIMIT_ROWS}</li>
      </ul>
      <ImportColumnReference />
      <div>
        <p className="iinfo__label">{IMPORT_COPY.EXAMPLE_LABEL}</p>
        <pre className="iinfo__code" tabIndex={0}>
          <code>{exampleCsv}</code>
        </pre>
        <p className="iinfo__note">{IMPORT_COPY.EXAMPLE_NOTE}</p>
      </div>
      <ImportTagsPanel />
    </section>
  );
}
