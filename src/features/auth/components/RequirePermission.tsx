import { Outlet } from 'react-router-dom';
import { Alert, Loader } from '@/components';
import { MESSAGES } from '@/constants';
import type { Permission } from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';

interface RequirePermissionProps {
  permissions: readonly Permission[];
}

// Cosmetic gate: the API enforces every permission itself.
export function RequirePermission({ permissions }: RequirePermissionProps) {
  const { hasAnyPermission, isLoading } = usePermissions();

  if (isLoading) return <Loader />;
  if (!hasAnyPermission(permissions)) return <Alert>{MESSAGES.ERROR_FORBIDDEN}</Alert>;
  return <Outlet />;
}
