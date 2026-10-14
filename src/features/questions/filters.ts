import { z } from 'zod';
import type { QuestionListParams } from '@/api';
import {
  DEFAULT_PAGE,
  NUMERIC_ID_REGEX,
  QUESTION_SEARCH_PARAMS as PARAM,
  QUESTIONS_PAGE_SIZE,
  SEARCH_MAX_LENGTH,
} from '@/constants';
import { joinCsv, splitCsv } from '@/utils/csv';

const idListSchema = z
  .string()
  .transform(splitCsv)
  .pipe(z.array(z.string().regex(NUMERIC_ID_REGEX)))
  .catch([]);

// Anything malformed in the URL falls back to its default instead of breaking the page.
export const questionFiltersSchema = z.object({
  page: z.coerce.number().int().min(DEFAULT_PAGE).catch(DEFAULT_PAGE),
  search: z.string().max(SEARCH_MAX_LENGTH).catch(''),
  clientId: z.uuid().catch(''),
  categories: idListSchema,
  tags: idListSchema,
});

export type QuestionFilters = z.infer<typeof questionFiltersSchema>;

export function parseFilters(searchParams: URLSearchParams): QuestionFilters {
  return questionFiltersSchema.parse({
    page: searchParams.get(PARAM.PAGE) ?? undefined,
    search: searchParams.get(PARAM.SEARCH) ?? undefined,
    clientId: searchParams.get(PARAM.CLIENT) ?? undefined,
    categories: searchParams.get(PARAM.CATEGORIES) ?? undefined,
    tags: searchParams.get(PARAM.TAGS) ?? undefined,
  });
}

export function buildSearchParams(filters: QuestionFilters): URLSearchParams {
  const next = new URLSearchParams();
  if (filters.page > DEFAULT_PAGE) next.set(PARAM.PAGE, String(filters.page));
  if (filters.search) next.set(PARAM.SEARCH, filters.search);
  if (filters.clientId) next.set(PARAM.CLIENT, filters.clientId);
  if (filters.categories.length) next.set(PARAM.CATEGORIES, joinCsv(filters.categories));
  if (filters.tags.length) next.set(PARAM.TAGS, joinCsv(filters.tags));
  return next;
}

// Tags only apply within selected categories, so they are ignored when none is selected.
export function toListParams(filters: QuestionFilters): QuestionListParams {
  const hasCategories = filters.categories.length > 0;
  return {
    page: filters.page,
    limit: QUESTIONS_PAGE_SIZE,
    clientId: filters.clientId || undefined,
    categories: filters.categories.map(Number),
    tags: hasCategories ? filters.tags.map(Number) : [],
    search: filters.search.trim() || undefined,
  };
}
