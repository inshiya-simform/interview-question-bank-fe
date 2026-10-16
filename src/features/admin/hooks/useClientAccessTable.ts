import { useClientAccessQuery } from '@/api/hooks';
import { CLIENT_ACCESS_PAGE_SIZE } from '@/constants';
import { useSession } from '@/features/auth';
import { toListParams } from '../filters';
import { useClientAccessFilters } from './useClientAccessFilters';

export function useClientAccessTable() {
  const { user } = useSession();
  const filterState = useClientAccessFilters();
  const query = useClientAccessQuery(user?.id, toListParams(filterState.filters));

  const total = query.data?.total ?? 0;

  return {
    ...filterState,
    clients: query.data?.clients ?? [],
    total,
    totalPages: Math.max(1, Math.ceil(total / CLIENT_ACCESS_PAGE_SIZE)),
    isLoading: query.isPending,
    isError: query.isError,
    hasData: query.data !== undefined,
    refetch: () => void query.refetch(),
  };
}
