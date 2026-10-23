import { z } from 'zod';
import { DEFAULT_PAGE, ROUTES, SAVED_SEARCH_PARAMS as PARAM } from '@/constants';

// Anything malformed in the URL falls back to its default instead of breaking the page.
const savedFiltersSchema = z.object({
  page: z.coerce.number().int().min(DEFAULT_PAGE).catch(DEFAULT_PAGE),
  collectionId: z.string().max(100).catch(''),
});

export type SavedFilters = z.infer<typeof savedFiltersSchema>;

export function parseSavedFilters(searchParams: URLSearchParams): SavedFilters {
  return savedFiltersSchema.parse({
    page: searchParams.get(PARAM.PAGE) ?? undefined,
    collectionId: searchParams.get(PARAM.COLLECTION) ?? undefined,
  });
}

export function buildSavedSearchParams(filters: SavedFilters): URLSearchParams {
  const next = new URLSearchParams();
  if (filters.collectionId) next.set(PARAM.COLLECTION, filters.collectionId);
  if (filters.page > DEFAULT_PAGE) next.set(PARAM.PAGE, String(filters.page));
  return next;
}

export function savedCollectionHref(collectionId?: string): string {
  const query = buildSavedSearchParams({ collectionId: collectionId ?? '', page: DEFAULT_PAGE });
  const search = query.toString();
  return search ? `${ROUTES.SAVED}?${search}` : ROUTES.SAVED;
}
