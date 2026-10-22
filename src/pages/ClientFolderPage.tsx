import { PageHeader } from '@/components';
import { ADMIN_COPY } from '@/constants';
import { ClientFolder } from '@/features/admin';

export function ClientFolderPage() {
  return (
    <>
      <PageHeader title={ADMIN_COPY.CLIENTS_TITLE} subtitle={ADMIN_COPY.CLIENTS_SUBTITLE} />
      <ClientFolder />
    </>
  );
}
