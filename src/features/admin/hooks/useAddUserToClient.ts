import { useState } from 'react';
import { grantClientAccessSchema } from '@/api';
import { useAdminUsersInfiniteQuery } from '@/api/hooks';
import { MESSAGES, SEARCH_DEBOUNCE_MS } from '@/constants';
import { useSession } from '@/features/auth';
import { useDebounce } from '@/hooks/useDebounce';

export function useAddUserToClient(onAdd: (email: string) => void) {
  const { user } = useSession();
  const [query, setQuery] = useState('');
  const search = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS);
  const usersQuery = useAdminUsersInfiniteQuery(user?.id, search);
  const [selected, setSelected] = useState({ id: '', email: '' });
  const [error, setError] = useState<string | undefined>();

  const users = usersQuery.data?.pages.flatMap((page) => page.users) ?? [];
  const options = users.map((candidate) => ({
    value: candidate.id,
    label: candidate.email,
    description: candidate.name,
  }));

  // The email is kept apart from the list because a new search can drop the selected user from it.
  const handleChange = (next: string) => {
    const match = users.find((candidate) => candidate.id === next);
    setSelected({ id: next, email: match?.email ?? '' });
    setError(undefined);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected.id) {
      setError(MESSAGES.USER_REQUIRED);
      return;
    }
    const result = grantClientAccessSchema.safeParse({ email: selected.email });
    if (result.success) onAdd(result.data.email);
    else setError(result.error.issues[0]?.message);
  };

  return {
    options,
    selectedId: selected.id,
    error,
    isLoading: usersQuery.isPending,
    hasMore: usersQuery.hasNextPage,
    isLoadingMore: usersQuery.isFetchingNextPage,
    loadMore: () => void usersQuery.fetchNextPage(),
    setQuery,
    handleChange,
    handleSubmit,
  };
}
