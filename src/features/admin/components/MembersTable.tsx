import { Alert, Badge, Button, Loader, Pagination, SelectField, TextField } from '@/components';
import { ADMIN_COPY, ROLE_LABELS } from '@/constants';
import { useMembersTable } from '../hooks/useMembersTable';
import './MembersTable.css';

export function MembersTable() {
  const {
    filters,
    searchInput,
    setSearchInput,
    setRole,
    setPage,
    roleOptions,
    members,
    total,
    totalPages,
    isLoading,
    isError,
    hasData,
    refetch,
  } = useMembersTable();

  return (
    <section className="members" aria-label={ADMIN_COPY.MEMBERS_LIST_LABEL}>
      <h2 className="members__title">{ADMIN_COPY.MEMBERS_LIST_LABEL}</h2>
      <div className="members__toolbar" role="search" aria-label={ADMIN_COPY.MEMBERS_FILTERS_LABEL}>
        <SelectField
          className="members__role"
          name="role"
          label={ADMIN_COPY.FIELD_ROLE_FILTER}
          placeholder={ADMIN_COPY.PLACEHOLDER_ROLE_FILTER}
          options={roleOptions}
          value={filters.role ?? ''}
          onChange={(event) => setRole(event.target.value)}
          clearable
        />
        <TextField
          className="members__search"
          type="search"
          name="search"
          label={ADMIN_COPY.FIELD_SEARCH}
          placeholder={ADMIN_COPY.PLACEHOLDER_MEMBER_SEARCH}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>
      <p className="members__count" aria-live="polite">
        {hasData ? ADMIN_COPY.MEMBER_COUNT(total) : ''}
      </p>
      {isLoading && <Loader label={ADMIN_COPY.LOADING_MEMBERS} />}
      {isError && !hasData && (
        <div className="members__error">
          <Alert>{ADMIN_COPY.LOAD_MEMBERS_ERROR}</Alert>
          <Button variant="secondary" onClick={refetch}>
            {ADMIN_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && members.length === 0 && (
        <p className="members__empty">{ADMIN_COPY.EMPTY_MEMBERS}</p>
      )}
      {members.length > 0 && (
        <div className="members__panel">
          <div className="members__scroll">
            <table className="members__table">
              <thead>
                <tr>
                  <th scope="col">{ADMIN_COPY.COLUMN_MEMBER}</th>
                  <th scope="col">{ADMIN_COPY.COLUMN_ROLE}</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <th scope="row">
                      <span className="members__name">{member.name}</span>
                      <span className="members__email">{member.email}</span>
                    </th>
                    <td>
                      <Badge variant="category">{ROLE_LABELS[member.role]}</Badge>
                    </td>
                  </tr>
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
          label={ADMIN_COPY.MEMBERS_PAGINATION_LABEL}
          previousLabel={ADMIN_COPY.PREVIOUS_PAGE}
          nextLabel={ADMIN_COPY.NEXT_PAGE}
          pageLabel={ADMIN_COPY.PAGE_NUMBER}
          statusLabel={ADMIN_COPY.PAGE_STATUS(filters.page, totalPages)}
        />
      )}
    </section>
  );
}
