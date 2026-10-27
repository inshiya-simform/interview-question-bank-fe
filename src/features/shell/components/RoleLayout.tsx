import { Loader } from '@/components';
import { SUPER_ADMIN_PERMISSIONS } from '@/constants';
import { SuperAdminLayout } from '@/features/admin';
import { usePermissions } from '@/hooks/usePermissions';
import { AppLayout } from './AppLayout';

// Super admins have no member navigation, so any member-area URL they open (including ones the
// guards forbid) renders inside their own shell rather than the member sidebar.
export function RoleLayout() {
  const { hasAnyPermission, isLoading } = usePermissions();

  if (isLoading) return <Loader />;
  return hasAnyPermission(SUPER_ADMIN_PERMISSIONS) ? <SuperAdminLayout /> : <AppLayout />;
}
