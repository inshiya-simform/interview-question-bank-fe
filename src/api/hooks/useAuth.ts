import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { getCurrentUser, getUserPermissions, login, register } from '../service/auth.service';
import { setAuthToken } from '../token-storage';

export function useCurrentUserQuery(enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH_ME,
    queryFn: getCurrentUser,
    enabled,
  });
}

export function useUserPermissionsQuery(enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH_PERMISSIONS,
    queryFn: getUserPermissions,
    enabled,
  });
}

// Drop any cache from a previous session before the new token takes effect.
function useStoreSession() {
  const queryClient = useQueryClient();
  return ({ token }: { token: string }) => {
    queryClient.clear();
    setAuthToken(token);
  };
}

export function useLoginMutation() {
  return useMutation({ mutationFn: login, onSuccess: useStoreSession() });
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: register, onSuccess: useStoreSession() });
}
