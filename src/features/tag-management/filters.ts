import { z } from 'zod';
import {
  DEFAULT_PAGE,
  SEARCH_MAX_LENGTH,
  TAG_MANAGEMENT_SEARCH_PARAMS as PARAM,
} from '@/constants';
import { UNUSED_FLAG_ON } from './constants';

// Anything malformed in the URL falls back to its default instead of breaking the page.
export const tagManagementFiltersSchema = z.object({
  category: z.coerce.number().int().min(1).optional().catch(undefined),
  categorySearch: z.string().max(SEARCH_MAX_LENGTH).catch(''),
  unusedOnly: z.boolean().catch(false),
  tagSearch: z.string().max(SEARCH_MAX_LENGTH).catch(''),
  page: z.coerce.number().int().min(DEFAULT_PAGE).catch(DEFAULT_PAGE),
});

export type TagManagementFilters = z.infer<typeof tagManagementFiltersSchema>;

export function parseTagManagementFilters(searchParams: URLSearchParams): TagManagementFilters {
  return tagManagementFiltersSchema.parse({
    category: searchParams.get(PARAM.CATEGORY) ?? undefined,
    categorySearch: searchParams.get(PARAM.CATEGORY_SEARCH) ?? undefined,
    unusedOnly: searchParams.get(PARAM.UNUSED_ONLY) === UNUSED_FLAG_ON,
    tagSearch: searchParams.get(PARAM.TAG_SEARCH) ?? undefined,
    page: searchParams.get(PARAM.PAGE) ?? undefined,
  });
}

export function buildTagManagementSearchParams(filters: TagManagementFilters): URLSearchParams {
  const next = new URLSearchParams();
  if (filters.category !== undefined) next.set(PARAM.CATEGORY, String(filters.category));
  if (filters.categorySearch) next.set(PARAM.CATEGORY_SEARCH, filters.categorySearch);
  if (filters.unusedOnly) next.set(PARAM.UNUSED_ONLY, UNUSED_FLAG_ON);
  if (filters.tagSearch) next.set(PARAM.TAG_SEARCH, filters.tagSearch);
  if (filters.page > DEFAULT_PAGE) next.set(PARAM.PAGE, String(filters.page));
  return next;
}
