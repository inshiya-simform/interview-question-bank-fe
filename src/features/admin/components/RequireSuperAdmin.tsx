import { Outlet } from 'react-router-dom';
import { Alert, Loader } from '@/components';
import { MESSAGES, SUPER_ADMIN_PERMISSIONS } from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';

// Cosmetic gate: the API enforces every admin permission itself.
export function RequireSuperAdmin() {
  const { hasAnyPermission, isLoading } = usePermissions();

  if (isLoading) return <Loader />;
  if (!hasAnyPermission(SUPER_ADMIN_PERMISSIONS)) return <Alert>{MESSAGES.ERROR_FORBIDDEN}</Alert>;
  return <Outlet />;
}
