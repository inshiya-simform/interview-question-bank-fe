import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ADMIN_USERS_PAGE_SIZE } from '@/constants';
import { QUERY_KEYS } from '../query-keys';
import {
  createClient,
  createStaff,
  getAdminUsers,
  getClientAccessList,
  grantClientAccess,
  revokeClientAccess,
} from '../service/admin.service';
import type { ClientAccessListParams } from '../type/admin/client-access-list';
import type { AdminUsersParams } from '../type/admin/users-list';

export function useClientAccessQuery(userId: string | undefined, params: ClientAccessListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENT_ACCESS(userId ?? '', params),
    queryFn: () => getClientAccessList(params),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

export function useAdminUsersQuery(userId: string | undefined, params: AdminUsersParams) {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_USERS_TABLE(userId ?? '', params),
    queryFn: () => getAdminUsers(params),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

export function useAdminUsersInfiniteQuery(userId: string | undefined, search: string) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.ADMIN_USERS(userId ?? '', search),
    queryFn: ({ pageParam }) =>
      getAdminUsers({
        page: pageParam,
        limit: ADMIN_USERS_PAGE_SIZE,
        search: search || undefined,
        excludeAdmin: true,
      }),
    initialPageParam: 1,
    getNextPageParam: ({ page, limit, total }) => (page * limit < total ? page + 1 : undefined),
    enabled: Boolean(userId),
  });
}

export function useCreateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS_LIST }),
  });
}

export function useGrantClientAccessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, email }: { clientId: string; email: string }) =>
      grantClientAccess(clientId, { email }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS_LIST }),
  });
}

export function useRevokeClientAccessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, userId }: { clientId: string; userId: string }) =>
      revokeClientAccess(clientId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS_LIST }),
  });
}

export function useCreateClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENT_ACCESS_LIST }),
  });
}
