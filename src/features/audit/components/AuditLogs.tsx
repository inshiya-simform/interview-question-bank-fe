import { Alert, Button, Loader, Pagination } from '@/components';
import { AUDIT_COPY, MESSAGES } from '@/constants';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { AuditLogFilters } from './AuditLogFilters';
import { AuditLogRow } from './AuditLogRow';
import './AuditLogs.css';

export function AuditLogs() {
  const audit = useAuditLogs();
  const { filters, logs, total, totalPages, hasData } = audit;

  return (
    <section className="audit" aria-label={AUDIT_COPY.LIST_LABEL}>
      <AuditLogFilters
        filters={filters}
        searchInput={audit.searchInput}
        moduleOptions={audit.moduleOptions}
        actionOptions={audit.actionOptions}
        hasActiveFilters={audit.hasActiveFilters}
        onSearchChange={audit.setSearchInput}
        onModuleChange={audit.setModule}
        onActionChange={audit.setAction}
        onFromChange={audit.setFrom}
        onToChange={audit.setTo}
        onClear={audit.clearFilters}
      />
      <p className="audit__count" aria-live="polite">
        {hasData ? AUDIT_COPY.ENTRY_COUNT(total) : ''}
      </p>
      {audit.isLoading && <Loader label={AUDIT_COPY.LOADING} />}
      {audit.isForbidden && <Alert>{MESSAGES.ERROR_FORBIDDEN}</Alert>}
      {audit.isError && !audit.isForbidden && !hasData && (
        <div className="audit__error">
          <Alert>{AUDIT_COPY.LOAD_ERROR}</Alert>
          <Button variant="secondary" onClick={audit.refetch}>
            {AUDIT_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && logs.length === 0 && <p className="audit__empty">{AUDIT_COPY.EMPTY}</p>}
      {logs.length > 0 && (
        <div className="audit__panel">
          <div className="audit__scroll">
            <table className="audit__table">
              <thead>
                <tr>
                  <th scope="col">{AUDIT_COPY.COLUMN_WHEN}</th>
                  <th scope="col">{AUDIT_COPY.COLUMN_ACTIVITY}</th>
                  <th scope="col">{AUDIT_COPY.COLUMN_MODULE}</th>
                  <th scope="col">{AUDIT_COPY.COLUMN_ACTOR}</th>
                  <th scope="col">{AUDIT_COPY.COLUMN_DETAILS}</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <AuditLogRow key={log.id} log={log} lookup={audit.lookup} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {totalPages > 1 && (
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={audit.setPage}
          label={AUDIT_COPY.PAGINATION_LABEL}
          previousLabel={AUDIT_COPY.PREVIOUS_PAGE}
          nextLabel={AUDIT_COPY.NEXT_PAGE}
          pageLabel={AUDIT_COPY.PAGE_NUMBER}
          statusLabel={AUDIT_COPY.PAGE_STATUS(filters.page, totalPages)}
        />
      )}
    </section>
  );
}
