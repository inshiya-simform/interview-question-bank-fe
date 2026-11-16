import { useEffect, useState } from 'react';
import { useManagedTagsQuery } from '@/api/hooks';
import { MANAGED_TAGS_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '@/constants';
import { useSession } from '@/features/auth';
import { useDebounce } from '@/hooks/useDebounce';
import { useTagManagementParams } from './useTagManagementParams';

export function useTagsTable(categoryId: number) {
  const { user } = useSession();
  const { filters, setTagSearch, setPage } = useTagManagementParams();
  const [searchInput, setSearchInput] = useState(filters.tagSearch);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedSearch !== filters.tagSearch) setTagSearch(debouncedSearch);
  }, [debouncedSearch, filters.tagSearch, setTagSearch]);

  const query = useManagedTagsQuery(user?.id, categoryId, {
    page: filters.page,
    limit: MANAGED_TAGS_PAGE_SIZE,
    search: filters.tagSearch.trim() || undefined,
  });

  const total = query.data?.total ?? 0;
  const tags = query.data?.tags ?? [];
  const firstItem = (filters.page - 1) * MANAGED_TAGS_PAGE_SIZE + 1;

  return {
    page: filters.page,
    setPage,
    searchInput,
    setSearchInput,
    tags,
    total,
    totalPages: Math.max(1, Math.ceil(total / MANAGED_TAGS_PAGE_SIZE)),
    range: { start: firstItem, end: firstItem + tags.length - 1 },
    isLoading: query.isPending,
    isError: query.isError,
    hasData: query.data !== undefined,
    refetch: () => void query.refetch(),
  };
}
