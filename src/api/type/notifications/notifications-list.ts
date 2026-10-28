import { z } from 'zod';
import { NOTIFICATION_FILTERS } from '@/constants';
import { notificationSchema } from './shared';

// Outbound query params: validated before sending. Filtering and paging are server-side.
export const notificationListParamsSchema = z.object({
  status: z.enum(NOTIFICATION_FILTERS).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export const notificationListResponseSchema = z.object({
  items: z.array(notificationSchema),
  page: z.number(),
  limit: z.number(),
  // Matches of the current status filter, used for paging.
  total: z.number(),
  // Always the overall unread count, regardless of the status filter.
  unreadCount: z.number(),
});

export type NotificationListParams = z.infer<typeof notificationListParamsSchema>;
export type NotificationListResponse = z.infer<typeof notificationListResponseSchema>;
