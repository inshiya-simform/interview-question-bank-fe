import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCurrentUserQuery } from '@/api/hooks';
import { clearAuthToken, getAuthToken } from '@/api';
import { ROUTES } from '@/constants';

export function useSession() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const hasToken = getAuthToken() !== null;
  const { data, isPending } = useCurrentUserQuery(hasToken);

  const user = hasToken ? data : undefined;

  const logout = () => {
    clearAuthToken();
    navigate(ROUTES.LOGIN, { replace: true });
    queryClient.clear();
  };

  return { user, isAuthenticated: user !== undefined, isLoading: hasToken && isPending, logout };
}
