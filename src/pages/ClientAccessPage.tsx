import { ADMIN_COPY } from '@/constants';
import { AdminPageHeader, ClientAccessTable } from '@/features/admin';

export function ClientAccessPage() {
  return (
    <>
      <AdminPageHeader title={ADMIN_COPY.CLIENTS_TITLE} subtitle={ADMIN_COPY.CLIENTS_SUBTITLE} />
      <ClientAccessTable />
    </>
  );
}
