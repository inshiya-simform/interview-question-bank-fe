import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '@/components';
import { ROUTES } from '@/constants';
import { useSession } from '../hooks/useSession';

export function GuestOnly() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading) return <Loader />;
  if (isAuthenticated) return <Navigate to={ROUTES.HOME} replace />;
  return <Outlet />;
}
