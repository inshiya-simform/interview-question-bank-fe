import { PageHeader } from '@/components';
import { AUDIT_COPY } from '@/constants';
import { AuditLogs } from '@/features/audit';

export function AuditLogsPage() {
  return (
    <>
      <PageHeader title={AUDIT_COPY.TITLE} subtitle={AUDIT_COPY.SUBTITLE} />
      <AuditLogs />
    </>
  );
}
