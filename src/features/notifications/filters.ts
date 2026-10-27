import { z } from 'zod';
import {
  DEFAULT_PAGE,
  NOTIFICATION_FILTER,
  NOTIFICATION_SEARCH_PARAMS as PARAM,
} from '@/constants';
import type { NotificationFilter } from '@/constants';

const filterSchema = z.enum(NOTIFICATION_FILTER).catch(NOTIFICATION_FILTER.ALL);
const pageSchema = z.coerce.number().int().min(DEFAULT_PAGE).catch(DEFAULT_PAGE);

export interface NotificationFilters {
  page: number;
  filter: NotificationFilter;
}

export function parseNotificationFilters(searchParams: URLSearchParams): NotificationFilters {
  return {
    page: pageSchema.parse(searchParams.get(PARAM.PAGE) ?? undefined),
    filter: filterSchema.parse(searchParams.get(PARAM.FILTER) ?? undefined),
  };
}

export function buildNotificationSearchParams(filters: NotificationFilters) {
  const next = new URLSearchParams();
  if (filters.page > DEFAULT_PAGE) next.set(PARAM.PAGE, String(filters.page));
  if (filters.filter !== NOTIFICATION_FILTER.ALL) next.set(PARAM.FILTER, filters.filter);
  return next;
}
