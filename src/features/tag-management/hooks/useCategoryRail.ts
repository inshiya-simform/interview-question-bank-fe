import { useEffect, useState } from 'react';
import { useTagCategoriesInfiniteQuery } from '@/api/hooks';
import { SEARCH_DEBOUNCE_MS } from '@/constants';
import { useSession } from '@/features/auth';
import { useDebounce } from '@/hooks/useDebounce';
import { useLoadMoreSentinel } from '@/hooks/useLoadMoreSentinel';
import { useSelectedCategoryId } from './useSelectedCategoryId';
import { useTagManagementParams } from './useTagManagementParams';

export function useCategoryRail() {
  const { user } = useSession();
  const { filters, selectCategory, setCategorySearch, setUnusedOnly } = useTagManagementParams();
  const { selectedId } = useSelectedCategoryId();
  const [searchInput, setSearchInput] = useState(filters.categorySearch);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedSearch !== filters.categorySearch) setCategorySearch(debouncedSearch);
  }, [debouncedSearch, filters.categorySearch, setCategorySearch]);

  const query = useTagCategoriesInfiniteQuery(user?.id, {
    search: filters.categorySearch.trim(),
    unused: filters.unusedOnly,
  });
  const categories = query.data?.pages.flatMap((page) => page.categories) ?? [];

  const loadMore = () => void query.fetchNextPage();
  const hasMore = Boolean(query.hasNextPage);
  const sentinelRef = useLoadMoreSentinel(loadMore, hasMore && !query.isFetchingNextPage);

  return {
    searchInput,
    setSearchInput,
    unusedOnly: filters.unusedOnly,
    setUnusedOnly,
    categories,
    total: query.data?.pages[0]?.total ?? 0,
    selectedId,
    select: selectCategory,
    isLoading: query.isPending,
    isError: query.isError,
    hasData: query.data !== undefined,
    hasMore,
    sentinelRef,
    refetch: () => void query.refetch(),
  };
}
