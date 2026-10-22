import { Link } from 'react-router-dom';
import { Alert, Badge, Button, Loader, Pagination, TextField } from '@/components';
import { ADMIN_COPY, ROUTES } from '@/constants';
import { useClientFolder } from '../hooks/useClientFolder';
import { AddUserToClient } from './AddUserToClient';
import { ClientFolderUsersTable } from './ClientFolderUsersTable';
import './ClientFolder.css';

export function ClientFolder() {
  const {
    filters,
    searchInput,
    setSearchInput,
    setPage,
    clientName,
    users,
    total,
    totalPages,
    rangeStart,
    rangeEnd,
    isLoading,
    isError,
    hasData,
    refetch,
    isAdding,
    toggleAdd,
    isGranting,
    isRevoking,
    grantUser,
    removeUser,
  } = useClientFolder();

  return (
    <section className="folder" aria-label={ADMIN_COPY.FOLDER_USERS_LABEL(clientName)}>
      <nav className="folder__crumbs" aria-label={ADMIN_COPY.BREADCRUMB_LABEL}>
        <Link to={ROUTES.ADMIN_CLIENTS}>{ADMIN_COPY.BREADCRUMB_CLIENTS}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{clientName}</span>
      </nav>
      <div className="folder__header">
        <h2 className="folder__title">{clientName}</h2>
        {hasData && <Badge variant="client">{ADMIN_COPY.USER_COUNT(total)}</Badge>}
      </div>
      <div className="folder__toolbar">
        <TextField
          className="folder__search"
          type="search"
          name="search"
          label={ADMIN_COPY.FIELD_USER_SEARCH}
          placeholder={ADMIN_COPY.PLACEHOLDER_USER_SEARCH}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        {!isAdding && <Button onClick={toggleAdd}>+ {ADMIN_COPY.ADD_USER}</Button>}
      </div>
      {isAdding && (
        <AddUserToClient isPending={isGranting} onAdd={grantUser} onCancel={toggleAdd} />
      )}
      {isLoading && <Loader label={ADMIN_COPY.LOADING_USERS} />}
      {isError && !hasData && (
        <div className="folder__error">
          <Alert>{ADMIN_COPY.LOAD_MEMBERS_ERROR}</Alert>
          <Button variant="secondary" onClick={refetch}>
            {ADMIN_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && users.length === 0 && (
        <p className="folder__empty">
          {filters.search ? ADMIN_COPY.NO_USERS_MATCH : ADMIN_COPY.NO_USERS}
        </p>
      )}
      {users.length > 0 && (
        <ClientFolderUsersTable
          clientName={clientName}
          users={users}
          isPending={isRevoking}
          onRemove={removeUser}
        />
      )}
      <p className="folder__range" aria-live="polite">
        {users.length > 0 ? ADMIN_COPY.USERS_RANGE(rangeStart, rangeEnd, total) : ''}
      </p>
      {totalPages > 1 && (
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={setPage}
          label={ADMIN_COPY.FOLDER_PAGINATION_LABEL}
          previousLabel={ADMIN_COPY.PREVIOUS_PAGE}
          nextLabel={ADMIN_COPY.NEXT_PAGE}
          pageLabel={ADMIN_COPY.PAGE_NUMBER}
          statusLabel={ADMIN_COPY.PAGE_STATUS(filters.page, totalPages)}
        />
      )}
    </section>
  );
}
