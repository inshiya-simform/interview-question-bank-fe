import { useCollectionsQuery } from '@/api/hooks';
import { PERMISSIONS } from '@/constants';
import { useSession } from '@/features/auth';
import { usePermissions } from '@/hooks/usePermissions';

export function useSavedState() {
  const { user } = useSession();
  const { hasAnyPermission } = usePermissions();
  // Users without question access (super admins) have no collections, and the API rejects the call.
  const query = useCollectionsQuery(user?.id, hasAnyPermission([PERMISSIONS.QUESTION_READ]));

  return {
    collections: query.data?.collections ?? [],
    totalSaved: query.data?.totalSaved ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    refetch: () => void query.refetch(),
  };
}
