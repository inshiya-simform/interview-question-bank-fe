import { useTagCategoryQuery } from '@/api/hooks';
import { useSession } from '@/features/auth';
import { useSelectedCategoryId } from './useSelectedCategoryId';

export function useCategoryPanel() {
  const { user } = useSession();
  const { selectedId, isResolving } = useSelectedCategoryId();
  const query = useTagCategoryQuery(user?.id, selectedId);

  return {
    category: query.data,
    isLoading: isResolving || (selectedId !== undefined && query.isPending),
    isError: query.isError,
    hasNoCategories: !isResolving && selectedId === undefined,
    refetch: () => void query.refetch(),
  };
}
