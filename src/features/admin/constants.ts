import type { SidebarNavItem } from '@/components';
import { ADMIN_COPY, AUDIT_COPY, PERMISSIONS, ROUTES } from '@/constants';
import type { Permission } from '@/constants';

interface AdminNavItem extends SidebarNavItem {
  // Items with a permission are hidden for users who lack it (cosmetic; the API enforces).
  permission?: Permission;
}

export const ADMIN_NAV_ITEMS = [
  { to: ROUTES.ADMIN_CLIENTS, label: ADMIN_COPY.NAV_CLIENTS, icon: 'clients' },
  { to: ROUTES.ADMIN_MEMBERS, label: ADMIN_COPY.NAV_MEMBERS, icon: 'members' },
  {
    to: ROUTES.ADMIN_AUDIT_LOGS,
    label: AUDIT_COPY.NAV,
    icon: 'audit',
    permission: PERMISSIONS.AUDIT_READ,
  },
] as const satisfies readonly AdminNavItem[];
