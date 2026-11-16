import { useTagCategoriesInfiniteQuery } from '@/api/hooks';
import { useSession } from '@/features/auth';
import { useTagManagementParams } from './useTagManagementParams';

// The URL decides the selection; without one the first listed category is shown.
export function useSelectedCategoryId() {
  const { user } = useSession();
  const { filters } = useTagManagementParams();
  const query = useTagCategoriesInfiniteQuery(user?.id, {
    search: filters.categorySearch.trim(),
    unused: filters.unusedOnly,
  });
  const firstId = query.data?.pages[0]?.categories[0]?.id;
  return { selectedId: filters.category ?? firstId, isResolving: query.isPending };
}
