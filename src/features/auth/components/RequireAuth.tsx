import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '@/components';
import { ROUTES } from '@/constants';
import { useTokenRefreshSchedule } from '@/hooks/useTokenRefreshSchedule';
import { useSession } from '../hooks/useSession';

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useSession();
  useTokenRefreshSchedule();

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return <Outlet />;
}
