import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '@/components';
import { ROUTES, SUPER_ADMIN_PERMISSIONS } from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';

// Super admins hold no question permissions, so the question list is not their landing page.
export function SuperAdminHomeRedirect() {
  const { hasAnyPermission, isLoading } = usePermissions();

  if (isLoading) return <Loader />;
  if (hasAnyPermission(SUPER_ADMIN_PERMISSIONS)) {
    return <Navigate to={ROUTES.ADMIN_CLIENTS} replace />;
  }
  return <Outlet />;
}
