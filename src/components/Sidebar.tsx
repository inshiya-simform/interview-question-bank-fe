import { NavLink } from 'react-router-dom';
import { getInitials } from '@/utils/initials';
import { Icon } from './Icon';
import type { IconName } from './iconPaths';
import './Sidebar.css';

export interface SidebarNavItem {
  to: string;
  label: string;
  icon: IconName;
  end?: boolean;
  count?: number;
  countLabel?: string;
}

interface SidebarProps {
  appName: string;
  tagline: string;
  navLabel: string;
  items: readonly SidebarNavItem[];
  userName: string;
  userDetail: string;
  userTitle?: string;
  logoutLabel: string;
  onLogout: () => void;
}

export function Sidebar({
  appName,
  tagline,
  navLabel,
  items,
  userName,
  userDetail,
  userTitle,
  logoutLabel,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__mark">
          <Icon name="brand" />
        </span>
        <span className="sidebar__titles">
          <span className="sidebar__app">{appName}</span>
          <span className="sidebar__tagline">{tagline}</span>
        </span>
      </div>
      <nav aria-label={navLabel} className="sidebar__nav">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className="sidebar__link">
            <Icon name={item.icon} />
            <span className="sidebar__label">{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
              <span className="sidebar__count" aria-label={item.countLabel}>
                {item.count}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__user" title={userTitle}>
        <span className="sidebar__avatar" aria-hidden="true">
          {getInitials(userName)}
        </span>
        <span className="sidebar__who">
          <span className="sidebar__name">{userName}</span>
          <span className="sidebar__detail">{userDetail}</span>
        </span>
        <button
          type="button"
          className="sidebar__logout"
          aria-label={logoutLabel}
          onClick={onLogout}
        >
          <Icon name="logout" />
        </button>
      </div>
    </aside>
  );
}
