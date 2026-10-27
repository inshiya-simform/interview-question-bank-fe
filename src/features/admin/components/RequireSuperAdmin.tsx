import { Outlet } from 'react-router-dom';
import { Loader } from '@/components';
import { SUPER_ADMIN_PERMISSIONS } from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';
import { ForbiddenPage } from '@/features/auth';

// Cosmetic gate: the API enforces every admin permission itself.
export function RequireSuperAdmin() {
  const { hasAnyPermission, isLoading } = usePermissions();

  if (isLoading) return <Loader />;
  if (!hasAnyPermission(SUPER_ADMIN_PERMISSIONS)) return <ForbiddenPage />;
  return <Outlet />;
}
