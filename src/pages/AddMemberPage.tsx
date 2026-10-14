import { ADMIN_COPY } from '@/constants';
import { AddMemberForm, AdminPageHeader, RolePermissionsPanel } from '@/features/admin';
import './AddMemberPage.css';

export function AddMemberPage() {
  return (
    <>
      <AdminPageHeader title={ADMIN_COPY.MEMBERS_TITLE} subtitle={ADMIN_COPY.MEMBERS_SUBTITLE} />
      <div className="member-page">
        <AddMemberForm />
        <RolePermissionsPanel />
      </div>
    </>
  );
}
