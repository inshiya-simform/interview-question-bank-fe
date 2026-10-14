import { Alert, Button, Loader, Pagination, TextField } from '@/components';
import { ADMIN_COPY } from '@/constants';
import { useClientAccessTable } from '../hooks/useClientAccessTable';
import { ClientAccessRow } from './ClientAccessRow';
import './ClientAccessTable.css';

export function ClientAccessTable() {
  const {
    filters,
    searchInput,
    setSearchInput,
    setPage,
    clients,
    total,
    totalPages,
    isLoading,
    isError,
    hasData,
    refetch,
  } = useClientAccessTable();

  return (
    <section className="access" aria-label={ADMIN_COPY.TABLE_LABEL}>
      <TextField
        className="access__search"
        type="search"
        name="search"
        label={ADMIN_COPY.FIELD_SEARCH}
        placeholder={ADMIN_COPY.PLACEHOLDER_SEARCH}
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
      />
      <p className="access__count" aria-live="polite">
        {hasData ? ADMIN_COPY.CLIENT_COUNT(total) : ''}
      </p>
      {isLoading && <Loader label={ADMIN_COPY.LOADING} />}
      {isError && !hasData && (
        <div className="access__error">
          <Alert>{ADMIN_COPY.LOAD_ERROR}</Alert>
          <Button variant="secondary" onClick={refetch}>
            {ADMIN_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && clients.length === 0 && (
        <p className="access__empty">{ADMIN_COPY.EMPTY_CLIENTS}</p>
      )}
      {clients.length > 0 && (
        <div className="access__panel">
          <div className="access__scroll">
            <table className="access__table">
              <thead>
                <tr>
                  <th scope="col">{ADMIN_COPY.COLUMN_CLIENT}</th>
                  <th scope="col">{ADMIN_COPY.COLUMN_USERS}</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <ClientAccessRow key={client.id} client={client} />
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
          onPageChange={setPage}
          label={ADMIN_COPY.PAGINATION_LABEL}
          previousLabel={ADMIN_COPY.PREVIOUS_PAGE}
          nextLabel={ADMIN_COPY.NEXT_PAGE}
          pageLabel={ADMIN_COPY.PAGE_NUMBER}
          statusLabel={ADMIN_COPY.PAGE_STATUS(filters.page, totalPages)}
        />
      )}
    </section>
  );
}
