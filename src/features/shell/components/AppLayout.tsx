import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components';
import { NotificationBell, useNotificationStream } from '@/features/notifications';
import { AUTH_COPY, HOME_COPY, REVIEW_COPY, SHELL_COPY } from '@/constants';
import { useAppLayout } from '../hooks/useAppLayout';
import './AppLayout.css';

export function AppLayout() {
  useNotificationStream();
  const { items, userName, userDetail, userTitle, logout } = useAppLayout();

  return (
    <div className="app-shell">
      <Sidebar
        appName={AUTH_COPY.APP_NAME}
        tagline={SHELL_COPY.TAGLINE}
        navLabel={REVIEW_COPY.NAV_LABEL}
        items={items}
        navSlot={<NotificationBell />}
        userName={userName}
        userDetail={userDetail}
        userTitle={userTitle}
        logoutLabel={HOME_COPY.LOGOUT}
        onLogout={logout}
      />
      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  );
}
