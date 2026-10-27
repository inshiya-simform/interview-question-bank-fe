import { Outlet } from 'react-router-dom';
import { Loader } from '@/components';
import type { Permission } from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';
import { ForbiddenPage } from './ForbiddenPage';

interface RequirePermissionProps {
  permissions: readonly Permission[];
}

// Cosmetic gate: the API enforces every permission itself.
export function RequirePermission({ permissions }: RequirePermissionProps) {
  const { hasAnyPermission, isLoading } = usePermissions();

  if (isLoading) return <Loader />;
  if (!hasAnyPermission(permissions)) return <ForbiddenPage />;
  return <Outlet />;
}
