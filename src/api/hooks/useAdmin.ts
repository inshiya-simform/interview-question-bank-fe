import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import {
  createClient,
  createStaff,
  getClientAccessList,
  grantClientAccess,
  revokeClientAccess,
} from '../service/admin.service';
import type { ClientAccessListParams } from '../type/admin/client-access-list';

export function useClientAccessQuery(userId: string | undefined, params: ClientAccessListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENT_ACCESS(userId ?? '', params),
    queryFn: () => getClientAccessList(params),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

export function useCreateStaffMutation() {
  return useMutation({ mutationFn: createStaff });
}

export function useGrantClientAccessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, email }: { clientId: string; email: string }) =>
      grantClientAccess(clientId, { email }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENT_ACCESS_LIST }),
  });
}

export function useRevokeClientAccessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, userId }: { clientId: string; userId: string }) =>
      revokeClientAccess(clientId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENT_ACCESS_LIST }),
  });
}

export function useCreateClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENT_ACCESS_LIST }),
  });
}
