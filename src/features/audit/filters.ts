import { z } from 'zod';
import type { AuditLogListParams } from '@/api';
import {
  AUDIT_ACTIONS,
  AUDIT_LOGS_PAGE_SIZE,
  AUDIT_MODULES,
  AUDIT_SEARCH_PARAMS as PARAM,
  DEFAULT_PAGE,
  ISO_DAY_REGEX,
  SEARCH_MAX_LENGTH,
} from '@/constants';
import { endOfLocalDayIso, startOfLocalDayIso } from '@/utils/date';

const dayParam = z
  .string()
  .regex(ISO_DAY_REGEX)
  .refine((value) => !Number.isNaN(Date.parse(value)))
  .optional()
  .catch(undefined);

// Anything malformed in the URL falls back to its default instead of breaking the page.
export const auditFiltersSchema = z.object({
  page: z.coerce.number().int().min(DEFAULT_PAGE).catch(DEFAULT_PAGE),
  module: z.enum(AUDIT_MODULES).optional().catch(undefined),
  action: z.enum(AUDIT_ACTIONS).optional().catch(undefined),
  search: z.string().max(SEARCH_MAX_LENGTH).catch(''),
  from: dayParam,
  to: dayParam,
});

export type AuditFilters = z.infer<typeof auditFiltersSchema>;

export function parseAuditFilters(searchParams: URLSearchParams): AuditFilters {
  return auditFiltersSchema.parse({
    page: searchParams.get(PARAM.PAGE) ?? undefined,
    module: searchParams.get(PARAM.MODULE) ?? undefined,
    action: searchParams.get(PARAM.ACTION) ?? undefined,
    search: searchParams.get(PARAM.SEARCH) ?? undefined,
    from: searchParams.get(PARAM.FROM) ?? undefined,
    to: searchParams.get(PARAM.TO) ?? undefined,
  });
}

export function buildAuditSearchParams(filters: AuditFilters): URLSearchParams {
  const next = new URLSearchParams();
  if (filters.page > DEFAULT_PAGE) next.set(PARAM.PAGE, String(filters.page));
  if (filters.module) next.set(PARAM.MODULE, filters.module);
  if (filters.action) next.set(PARAM.ACTION, filters.action);
  if (filters.search) next.set(PARAM.SEARCH, filters.search);
  if (filters.from) next.set(PARAM.FROM, filters.from);
  if (filters.to) next.set(PARAM.TO, filters.to);
  return next;
}

export function hasActiveAuditFilters(filters: AuditFilters): boolean {
  return Boolean(filters.module || filters.action || filters.search || filters.from || filters.to);
}

// Day inputs are inclusive, so the range runs from the start of `from` to the end of `to`.
export function toAuditListParams(filters: AuditFilters): AuditLogListParams {
  return {
    page: filters.page,
    limit: AUDIT_LOGS_PAGE_SIZE,
    module: filters.module,
    action: filters.action,
    search: filters.search.trim() || undefined,
    from: filters.from ? startOfLocalDayIso(filters.from) : undefined,
    to: filters.to ? endOfLocalDayIso(filters.to) : undefined,
  };
}
