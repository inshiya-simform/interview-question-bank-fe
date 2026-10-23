import { ROLE_LABELS } from '@/constants';
import { useSession } from '@/features/auth';
import { usePermissions } from '@/hooks/usePermissions';
import { ADMIN_NAV_ITEMS } from '../constants';

export function useSuperAdminLayout() {
  const { user, logout } = useSession();
  const { hasAnyPermission } = usePermissions();
  const navItems = ADMIN_NAV_ITEMS.filter(
    (item) => !('permission' in item) || hasAnyPermission([item.permission]),
  );
  return {
    navItems,
    name: user?.name ?? '',
    roleLabel: user ? ROLE_LABELS[user.role] : '',
    email: user?.email ?? '',
    logout,
  };
}
