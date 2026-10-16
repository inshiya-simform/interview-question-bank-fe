import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '@/components';
import { ADMIN_COPY, AUTH_COPY, HOME_COPY } from '@/constants';
import { ADMIN_NAV_ITEMS } from '../constants';
import { useSuperAdminLayout } from '../hooks/useSuperAdminLayout';
import './SuperAdminLayout.css';

export function SuperAdminLayout() {
  const { name, email, logout } = useSuperAdminLayout();

  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar">
        <div className="admin-shell__brand">
          <span className="admin-shell__app">{AUTH_COPY.APP_NAME}</span>
          <span className="admin-shell__section">{ADMIN_COPY.SECTION_LABEL}</span>
        </div>
        <nav aria-label={ADMIN_COPY.NAV_LABEL} className="admin-shell__nav">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className="admin-shell__link">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-shell__user">
          <span className="admin-shell__name">{name}</span>
          <span className="admin-shell__email">{email}</span>
          <Button variant="secondary" onClick={logout}>
            {HOME_COPY.LOGOUT}
          </Button>
        </div>
      </aside>
      <main className="admin-shell__content">
        <Outlet />
      </main>
    </div>
  );
}
