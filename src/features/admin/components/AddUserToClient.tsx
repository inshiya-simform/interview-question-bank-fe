import { Button, Combobox } from '@/components';
import { ADMIN_COPY } from '@/constants';
import { useAddUserToClient } from '../hooks/useAddUserToClient';
import './AddUserToClient.css';

interface AddUserToClientProps {
  isPending: boolean;
  onAdd: (email: string) => void;
  onCancel: () => void;
}

export function AddUserToClient({ isPending, onAdd, onCancel }: AddUserToClientProps) {
  const {
    options,
    selectedId,
    error,
    isLoading,
    hasMore,
    isLoadingMore,
    loadMore,
    setQuery,
    handleChange,
    handleSubmit,
  } = useAddUserToClient(onAdd);

  return (
    <form className="add-user" onSubmit={handleSubmit} noValidate>
      <Combobox
        className="add-user__email"
        label={ADMIN_COPY.FIELD_USER}
        options={options}
        value={selectedId}
        onChange={handleChange}
        placeholder={ADMIN_COPY.PLACEHOLDER_USER}
        emptyText={ADMIN_COPY.NO_USERS_MATCH}
        loadingText={ADMIN_COPY.LOADING_USERS}
        isLoading={isLoading}
        onQueryChange={setQuery}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        autoFocus
        error={error}
      />
      <Button type="submit" isLoading={isPending}>
        {ADMIN_COPY.CONFIRM_ADD}
      </Button>
      <Button variant="secondary" onClick={onCancel} disabled={isPending}>
        {ADMIN_COPY.CANCEL}
      </Button>
    </form>
  );
}
