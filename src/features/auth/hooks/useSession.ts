import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCurrentUserQuery, useLogoutMutation } from '@/api/hooks';
import { clearAuthToken, getAuthToken, getRefreshToken } from '@/api';
import { ROUTES } from '@/constants';

export function useSession() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: revokeSession } = useLogoutMutation();
  const hasToken = getAuthToken() !== null;
  const { data, isPending } = useCurrentUserQuery(hasToken);

  const user = hasToken ? data : undefined;

  const logout = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await revokeSession({ refreshToken });
      } catch {
        // Signing out must not depend on the server being reachable.
      }
    }
    clearAuthToken();
    navigate(ROUTES.LOGIN, { replace: true });
    queryClient.clear();
  };

  return { user, isAuthenticated: user !== undefined, isLoading: hasToken && isPending, logout };
}
