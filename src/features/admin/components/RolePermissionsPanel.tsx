import { ADMIN_COPY, STAFF_ROLES, STAFF_ROLE_COPY } from '@/constants';
import './RolePermissionsPanel.css';

export function RolePermissionsPanel() {
  return (
    <aside className="role-panel" aria-labelledby="role-panel-title">
      <h2 id="role-panel-title" className="role-panel__title">
        {ADMIN_COPY.PERMISSIONS_TITLE}
      </h2>
      <dl className="role-panel__list">
        {STAFF_ROLES.map((role) => (
          <div key={role} className="role-panel__item">
            <dt className="role-panel__role">{role}</dt>
            <dd className="role-panel__capability">{STAFF_ROLE_COPY[role].CAPABILITY}</dd>
          </div>
        ))}
      </dl>
      <p className="role-panel__note">{ADMIN_COPY.PERMISSIONS_NOTE}</p>
    </aside>
  );
}
