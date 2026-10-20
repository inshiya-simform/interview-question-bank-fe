import { Link } from 'react-router-dom';
import { IMPORT_COPY, ROUTES } from '@/constants';
import { useImportCsvEntry } from '../hooks/useImportCsvEntry';
import './ImportCsvEntry.css';

export function ImportCsvEntry() {
  const { canImport } = useImportCsvEntry();
  if (!canImport) return null;

  return (
    <Link className="btn btn--secondary import-entry" to={ROUTES.IMPORT}>
      {IMPORT_COPY.ENTRY}
    </Link>
  );
}
