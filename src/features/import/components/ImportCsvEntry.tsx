import { Link } from 'react-router-dom';
import { IMPORT_COPY, ROUTES } from '@/constants';
import { MOCK_CAN_IMPORT } from '../constants';
import './ImportCsvEntry.css';

export function ImportCsvEntry() {
  if (!MOCK_CAN_IMPORT) return null;

  return (
    <Link className="btn btn--secondary import-entry" to={ROUTES.IMPORT}>
      {IMPORT_COPY.ENTRY}
    </Link>
  );
}
