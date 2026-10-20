import { IMPORT_COLUMNS, IMPORT_COPY } from '@/constants';
import './ImportColumnReference.css';

const requirementLabel = (column: (typeof IMPORT_COLUMNS)[number]) => {
  if ('conditional' in column) return IMPORT_COPY.REQUIRED_IF;
  return 'required' in column ? IMPORT_COPY.REQUIRED_YES : IMPORT_COPY.REQUIRED_NO;
};

export function ImportColumnReference() {
  return (
    <details className="idetails">
      <summary className="idetails__summary">{IMPORT_COPY.COLUMNS_SUMMARY}</summary>
      <div className="idetails__body">
        <div className="icols">
          <table className="icols__table" aria-label={IMPORT_COPY.COLUMN_TABLE_LABEL}>
            <thead>
              <tr>
                <th scope="col">{IMPORT_COPY.COLUMN_HEADERS.NAME}</th>
                <th scope="col">{IMPORT_COPY.COLUMN_HEADERS.REQUIRED}</th>
                <th scope="col">{IMPORT_COPY.COLUMN_HEADERS.DESCRIPTION}</th>
              </tr>
            </thead>
            <tbody>
              {IMPORT_COLUMNS.map((column) => (
                <tr key={column.name}>
                  <th scope="row">
                    <code>{column.name}</code>
                  </th>
                  <td>{requirementLabel(column)}</td>
                  <td>{IMPORT_COPY.COLUMN_DESCRIPTIONS[column.name]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  );
}
