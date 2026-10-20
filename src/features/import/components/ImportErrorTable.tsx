import { IMPORT_COPY, IMPORT_DUPLICATE_PATTERN } from '@/constants';
import { rowLabel, type ErrorGroup } from '../utils';
import { ImportDuplicateHint } from './ImportDuplicateHint';
import './ImportErrorTable.css';

interface ImportErrorTableProps {
  groups: readonly ErrorGroup[];
}

export function ImportErrorTable({ groups }: ImportErrorTableProps) {
  return (
    <div className="etable" tabIndex={0} role="region" aria-label={IMPORT_COPY.TABLE_LABEL}>
      <table className="etable__table">
        <thead>
          <tr>
            <th scope="col">{IMPORT_COPY.TABLE_HEADERS.ROW}</th>
            <th scope="col">{IMPORT_COPY.TABLE_HEADERS.COLUMN}</th>
            <th scope="col">{IMPORT_COPY.TABLE_HEADERS.PROBLEM}</th>
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.row} className="etable__group">
            {group.errors.map((error, index) => (
              <tr key={`${error.column ?? ''}-${error.message}`}>
                {index === 0 && (
                  <th scope="rowgroup" rowSpan={group.errors.length} className="etable__row">
                    {rowLabel(group.row)}
                  </th>
                )}
                <td>{error.column && <code className="etable__chip">{error.column}</code>}</td>
                <td>
                  {error.message}
                  {IMPORT_DUPLICATE_PATTERN.test(error.message) && <ImportDuplicateHint />}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
