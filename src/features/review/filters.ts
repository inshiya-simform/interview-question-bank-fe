import { z } from 'zod';
import {
  ALL_STATUSES,
  DEFAULT_PAGE,
  REVIEW_SEARCH_PARAMS as PARAM,
  REVIEW_STATUS,
} from '@/constants';
import type { StatusTab } from '@/constants';

const tabSchema = z.union([z.enum(REVIEW_STATUS), z.literal(ALL_STATUSES)]);
const pageSchema = z.coerce.number().int().min(DEFAULT_PAGE).catch(DEFAULT_PAGE);

export interface ReviewFilters {
  page: number;
  status: StatusTab;
}

// An unknown or disallowed status in the URL falls back to the page's default tab.
export function parseReviewFilters(
  searchParams: URLSearchParams,
  allowed: readonly StatusTab[],
  fallback: StatusTab,
): ReviewFilters {
  const status = tabSchema.safeParse(searchParams.get(PARAM.STATUS) ?? fallback);
  return {
    page: pageSchema.parse(searchParams.get(PARAM.PAGE) ?? undefined),
    status: status.success && allowed.includes(status.data) ? status.data : fallback,
  };
}

export function buildReviewSearchParams(filters: ReviewFilters, fallback: StatusTab) {
  const next = new URLSearchParams();
  if (filters.page > DEFAULT_PAGE) next.set(PARAM.PAGE, String(filters.page));
  if (filters.status !== fallback) next.set(PARAM.STATUS, filters.status);
  return next;
}
