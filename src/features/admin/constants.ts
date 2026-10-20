import type { SidebarNavItem } from '@/components';
import { ADMIN_COPY, ROUTES } from '@/constants';

export const ADMIN_NAV_ITEMS = [
  { to: ROUTES.ADMIN_CLIENTS, label: ADMIN_COPY.NAV_CLIENTS, icon: 'clients' },
  { to: ROUTES.ADMIN_MEMBERS, label: ADMIN_COPY.NAV_MEMBERS, icon: 'members' },
] as const satisfies readonly SidebarNavItem[];
