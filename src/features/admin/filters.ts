import { z } from 'zod';
import type { AdminUsersParams, ClientAccessListParams } from '@/api';
import {
  ADMIN_SEARCH_PARAMS as PARAM,
  CLIENT_ACCESS_PAGE_SIZE,
  CLIENT_FOLDER_USERS_PAGE_SIZE,
  DEFAULT_PAGE,
  SEARCH_MAX_LENGTH,
} from '@/constants';

// Anything malformed in the URL falls back to its default instead of breaking the page.
export const clientAccessFiltersSchema = z.object({
  page: z.coerce.number().int().min(DEFAULT_PAGE).catch(DEFAULT_PAGE),
  search: z.string().max(SEARCH_MAX_LENGTH).catch(''),
});

export type ClientAccessFilters = z.infer<typeof clientAccessFiltersSchema>;

export function parseFilters(searchParams: URLSearchParams): ClientAccessFilters {
  return clientAccessFiltersSchema.parse({
    page: searchParams.get(PARAM.PAGE) ?? undefined,
    search: searchParams.get(PARAM.SEARCH) ?? undefined,
  });
}

export function buildSearchParams(filters: ClientAccessFilters): URLSearchParams {
  const next = new URLSearchParams();
  if (filters.page > DEFAULT_PAGE) next.set(PARAM.PAGE, String(filters.page));
  if (filters.search) next.set(PARAM.SEARCH, filters.search);
  return next;
}

// A folder's users are the admin users list narrowed to one client.
export function toFolderUsersParams(
  filters: ClientAccessFilters,
  clientId: string,
): AdminUsersParams {
  return {
    page: filters.page,
    limit: CLIENT_FOLDER_USERS_PAGE_SIZE,
    search: filters.search.trim() || undefined,
    clientId,
    excludeAdmin: true,
  };
}

// The grid passes the client's name along so the folder page can show it without a lookup.
export const folderLocationStateSchema = z.object({ clientName: z.string() });

export function toListParams(filters: ClientAccessFilters): ClientAccessListParams {
  return {
    page: filters.page,
    limit: CLIENT_ACCESS_PAGE_SIZE,
    search: filters.search.trim() || undefined,
  };
}
