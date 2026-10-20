import { z } from 'zod';
import type { AdminUsersParams } from '@/api';
import {
  DEFAULT_PAGE,
  MEMBERS_PAGE_SIZE,
  MEMBER_LIST_ROLES,
  MEMBER_SEARCH_PARAMS as PARAM,
  SEARCH_MAX_LENGTH,
} from '@/constants';

// Anything malformed in the URL falls back to its default instead of breaking the page.
export const memberFiltersSchema = z.object({
  page: z.coerce.number().int().min(DEFAULT_PAGE).catch(DEFAULT_PAGE),
  search: z.string().max(SEARCH_MAX_LENGTH).catch(''),
  role: z.enum(MEMBER_LIST_ROLES).optional().catch(undefined),
});

export type MemberFilters = z.infer<typeof memberFiltersSchema>;

export function parseMemberFilters(searchParams: URLSearchParams): MemberFilters {
  return memberFiltersSchema.parse({
    page: searchParams.get(PARAM.PAGE) ?? undefined,
    search: searchParams.get(PARAM.SEARCH) ?? undefined,
    role: searchParams.get(PARAM.ROLE) ?? undefined,
  });
}

export function buildMemberSearchParams(filters: MemberFilters): URLSearchParams {
  const next = new URLSearchParams();
  if (filters.page > DEFAULT_PAGE) next.set(PARAM.PAGE, String(filters.page));
  if (filters.search) next.set(PARAM.SEARCH, filters.search);
  if (filters.role) next.set(PARAM.ROLE, filters.role);
  return next;
}

export function toMemberListParams(filters: MemberFilters): AdminUsersParams {
  return {
    page: filters.page,
    limit: MEMBERS_PAGE_SIZE,
    search: filters.search.trim() || undefined,
    role: filters.role,
    excludeAdmin: true,
  };
}
