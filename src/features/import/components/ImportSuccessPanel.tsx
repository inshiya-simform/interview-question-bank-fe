import { Link } from 'react-router-dom';
import type { ImportSuccess } from '@/api';
import { Button } from '@/components';
import { IMPORT_COPY, IMPORT_PREVIEW_LIMIT, ROUTES } from '@/constants';
import './ImportStatus.css';

interface ImportSuccessPanelProps {
  result: ImportSuccess;
  onImportAnother: () => void;
}

export function ImportSuccessPanel({ result, onImportAnother }: ImportSuccessPanelProps) {
  const shown = result.questions.slice(0, IMPORT_PREVIEW_LIMIT);
  const hidden = result.imported - shown.length;

  return (
    <div className="istatus istatus--strong">
      <h2 className="istatus__title">
        <span aria-hidden="true">✓ </span>
        {IMPORT_COPY.SUCCESS(result.imported)}
      </h2>
      <ul className="istatus__list" aria-label={IMPORT_COPY.SUCCESS_LIST_LABEL}>
        {shown.map((question) => (
          <li key={question.id}>{question.text}</li>
        ))}
        {hidden > 0 && <li className="istatus__more">{IMPORT_COPY.SUCCESS_MORE(hidden)}</li>}
      </ul>
      <div className="istatus__actions">
        <Link className="btn btn--primary istatus__link" to={ROUTES.MY_QUESTIONS}>
          {IMPORT_COPY.MY_SUBMISSIONS}
        </Link>
        <Button variant="secondary" onClick={onImportAnother}>
          {IMPORT_COPY.IMPORT_ANOTHER}
        </Button>
      </div>
    </div>
  );
}
