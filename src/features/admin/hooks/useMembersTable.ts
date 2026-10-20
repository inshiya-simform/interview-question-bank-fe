import { useAdminUsersQuery } from '@/api/hooks';
import { MEMBERS_PAGE_SIZE, MEMBER_LIST_ROLES, ROLE_LABELS } from '@/constants';
import { useSession } from '@/features/auth';
import { toMemberListParams } from '../memberFilters';
import { useMembersFilters } from './useMembersFilters';

const ROLE_OPTIONS = MEMBER_LIST_ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] }));

export function useMembersTable() {
  const { user } = useSession();
  const filterState = useMembersFilters();
  const query = useAdminUsersQuery(user?.id, toMemberListParams(filterState.filters));

  const total = query.data?.total ?? 0;

  return {
    ...filterState,
    roleOptions: ROLE_OPTIONS,
    members: query.data?.users ?? [],
    total,
    totalPages: Math.max(1, Math.ceil(total / MEMBERS_PAGE_SIZE)),
    isLoading: query.isPending,
    isError: query.isError,
    hasData: query.data !== undefined,
    refetch: () => void query.refetch(),
  };
}
