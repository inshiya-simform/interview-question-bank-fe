import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'react-toastify';
import type { ManagedCategory, ManagedTag } from '@/api';
import { getErrorMessage } from '@/api/errors';
import { useMoveManagedTagMutation, useTagCategoriesInfiniteQuery } from '@/api/hooks';
import { MESSAGES, SEARCH_DEBOUNCE_MS, TAG_COPY } from '@/constants';
import { useSession } from '@/features/auth';
import { useDebounce } from '@/hooks/useDebounce';
import { isConflictError } from '../errors';

export function useMoveTagModal(tag: ManagedTag, category: ManagedCategory, onClose: () => void) {
  const { user } = useSession();
  const mutation = useMoveManagedTagMutation();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const [targetId, setTargetId] = useState('');
  const [error, setError] = useState<string | undefined>();

  const query = useTagCategoriesInfiniteQuery(user?.id, {
    search: debouncedSearch.trim(),
    unused: false,
  });
  const candidates = (query.data?.pages.flatMap((page) => page.categories) ?? []).filter(
    (candidate) => candidate.id !== category.id,
  );
  const options = candidates.map((candidate) => ({
    value: String(candidate.id),
    label: candidate.name,
  }));
  const target = candidates.find((candidate) => String(candidate.id) === targetId);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!target) {
      setError(MESSAGES.CATEGORY_REQUIRED);
      return;
    }
    mutation.mutate(
      { tagId: tag.id, categoryId: target.id },
      {
        onSuccess: () => {
          toast.success(MESSAGES.TAG_MOVED);
          onClose();
        },
        onError: (failure) =>
          isConflictError(failure)
            ? setError(TAG_COPY.TAG_NAME_TAKEN(tag.name, target.name))
            : toast.error(getErrorMessage(failure)),
      },
    );
  };

  return {
    options,
    targetId,
    target,
    error,
    isLoading: query.isPending,
    hasMore: Boolean(query.hasNextPage),
    isLoadingMore: query.isFetchingNextPage,
    loadMore: () => void query.fetchNextPage(),
    setSearch,
    select: (next: string) => {
      setError(undefined);
      setTargetId(next);
    },
    handleSubmit,
    isPending: mutation.isPending,
  };
}
