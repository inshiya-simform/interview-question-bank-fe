import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { SILENT_ERROR_META } from '../query-meta';
import {
  changePassword,
  forgotPassword,
  getCurrentUser,
  getUserPermissions,
  login,
  register,
  resetPassword,
  verifyResetToken,
} from '../service/auth.service';
import { clearAuthToken, setAuthToken } from '../token-storage';

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

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: forgotPassword, meta: SILENT_ERROR_META });
}

// Reset tokens are single-use, so the check must run once per page load and never refetch.
export function useVerifyResetTokenQuery(token: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.RESET_TOKEN_VERIFY(token ?? ''),
    queryFn: () => verifyResetToken(token ?? ''),
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    meta: SILENT_ERROR_META,
  });
}

// A reset revokes every earlier session, so a token still stored in this browser is now dead.
export function useResetPasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetPassword,
    meta: SILENT_ERROR_META,
    onSuccess: () => {
      clearAuthToken();
      queryClient.clear();
    },
  });
}

// The old token is revoked by the change, so the returned one must be stored before any further
// request. The user and cache stay: this is still the same person on this device.
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changePassword,
    meta: SILENT_ERROR_META,
    onSuccess: ({ token }) => setAuthToken(token),
  });
}
