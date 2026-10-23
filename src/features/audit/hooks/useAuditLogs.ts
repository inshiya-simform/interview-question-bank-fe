import { useAuditLogsQuery } from '@/api/hooks';
import { ApiError } from '@/api/errors';
import {
  AUDIT_ACTION_LABEL,
  AUDIT_LOGS_PAGE_SIZE,
  AUDIT_MODULE_LABEL,
  HTTP_STATUS,
} from '@/constants';
import type { AuditAction, AuditModule } from '@/constants';
import { useSession } from '@/features/auth';
import { toAuditListParams } from '../filters';
import { useAuditLogFilters } from './useAuditLogFilters';
import { useTagLookup } from './useTagLookup';

const toOptions = <T extends string>(labels: Record<T, string>) =>
  Object.entries<string>(labels).map(([value, label]) => ({ value, label }));

const MODULE_OPTIONS = toOptions<AuditModule>(AUDIT_MODULE_LABEL);
const ACTION_OPTIONS = toOptions<AuditAction>(AUDIT_ACTION_LABEL);

export function useAuditLogs() {
  const { user } = useSession();
  const filterState = useAuditLogFilters();
  const lookup = useTagLookup();
  const query = useAuditLogsQuery(user?.id, toAuditListParams(filterState.filters));

  const total = query.data?.total ?? 0;

  return {
    ...filterState,
    moduleOptions: MODULE_OPTIONS,
    actionOptions: ACTION_OPTIONS,
    lookup,
    logs: query.data?.logs ?? [],
    total,
    totalPages: Math.max(1, Math.ceil(total / AUDIT_LOGS_PAGE_SIZE)),
    isLoading: query.isPending,
    isError: query.isError,
    // The route gate is cosmetic, so a 403 from the API gets the standard no-access state.
    isForbidden: query.error instanceof ApiError && query.error.status === HTTP_STATUS.FORBIDDEN,
    hasData: query.data !== undefined,
    refetch: () => void query.refetch(),
  };
}
