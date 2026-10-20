import { PageHeader } from '@/components';
import { ADMIN_COPY } from '@/constants';
import { ClientAccessTable } from '@/features/admin';

export function ClientAccessPage() {
  return (
    <>
      <PageHeader title={ADMIN_COPY.CLIENTS_TITLE} subtitle={ADMIN_COPY.CLIENTS_SUBTITLE} />
      <ClientAccessTable />
    </>
  );
}
