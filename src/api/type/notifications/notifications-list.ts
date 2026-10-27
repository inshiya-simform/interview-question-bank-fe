import { z } from 'zod';
import { NOTIFICATION_FILTERS } from '@/constants';
import { notificationSchema } from './shared';

// Outbound query params: validated before sending. Filtering and paging are server-side.
export const notificationListParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
  filter: z.enum(NOTIFICATION_FILTERS).optional(),
});

export const notificationListResponseSchema = z.object({
  notifications: z.array(notificationSchema),
  page: z.number(),
  limit: z.number(),
  // Matches of the current filter, used for paging.
  total: z.number(),
  // Every notification the user has, regardless of the filter.
  totalAll: z.number(),
  unreadCount: z.number(),
});

export type NotificationListParams = z.infer<typeof notificationListParamsSchema>;
export type NotificationListResponse = z.infer<typeof notificationListResponseSchema>;
