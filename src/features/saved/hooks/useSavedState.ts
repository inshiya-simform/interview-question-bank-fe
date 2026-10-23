import { useCollectionsQuery } from '@/api/hooks';
import { useSession } from '@/features/auth';

export function useSavedState() {
  const { user } = useSession();
  const query = useCollectionsQuery(user?.id);

  return {
    collections: query.data?.collections ?? [],
    totalSaved: query.data?.totalSaved ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    refetch: () => void query.refetch(),
  };
}
