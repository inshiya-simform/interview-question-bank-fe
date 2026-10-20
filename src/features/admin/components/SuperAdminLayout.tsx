import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components';
import { ADMIN_COPY, AUTH_COPY, HOME_COPY } from '@/constants';
import { ADMIN_NAV_ITEMS } from '../constants';
import { useSuperAdminLayout } from '../hooks/useSuperAdminLayout';
import './SuperAdminLayout.css';

export function SuperAdminLayout() {
  const { name, roleLabel, email, logout } = useSuperAdminLayout();

  return (
    <div className="admin-shell">
      <Sidebar
        appName={AUTH_COPY.APP_NAME}
        tagline={ADMIN_COPY.SECTION_LABEL}
        navLabel={ADMIN_COPY.NAV_LABEL}
        items={ADMIN_NAV_ITEMS}
        userName={name}
        userDetail={roleLabel}
        userTitle={email}
        logoutLabel={HOME_COPY.LOGOUT}
        onLogout={logout}
      />
      <main className="admin-shell__content">
        <Outlet />
      </main>
    </div>
  );
}
