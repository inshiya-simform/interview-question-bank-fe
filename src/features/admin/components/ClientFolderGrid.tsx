import { Alert, Button, Loader, Pagination, TextField } from '@/components';
import { ADMIN_COPY } from '@/constants';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useClientFolderGrid } from '../hooks/useClientFolderGrid';
import { AddClientForm } from './AddClientForm';
import { ClientFolderCard } from './ClientFolderCard';
import './ClientFolderGrid.css';

export function ClientFolderGrid() {
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
  } = useClientFolderGrid();
  const addClient = useDisclosure();

  return (
    <section className="folders" aria-label={ADMIN_COPY.FOLDERS_LABEL}>
      <div className="folders__toolbar">
        <TextField
          className="folders__search"
          type="search"
          name="search"
          label={ADMIN_COPY.FIELD_SEARCH}
          placeholder={ADMIN_COPY.PLACEHOLDER_SEARCH}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        {!addClient.isOpen && <Button onClick={addClient.toggle}>+ {ADMIN_COPY.ADD_CLIENT}</Button>}
      </div>
      {addClient.isOpen && <AddClientForm onDone={addClient.toggle} />}
      <p className="folders__count" aria-live="polite">
        {hasData ? ADMIN_COPY.CLIENT_COUNT(total) : ''}
      </p>
      {isLoading && <Loader label={ADMIN_COPY.LOADING} />}
      {isError && !hasData && (
        <div className="folders__error">
          <Alert>{ADMIN_COPY.LOAD_ERROR}</Alert>
          <Button variant="secondary" onClick={refetch}>
            {ADMIN_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && clients.length === 0 && (
        <p className="folders__empty">{ADMIN_COPY.EMPTY_CLIENTS}</p>
      )}
      {clients.length > 0 && (
        <ul className="folders__grid">
          {clients.map((client) => (
            <li key={client.id}>
              <ClientFolderCard client={client} />
            </li>
          ))}
        </ul>
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
