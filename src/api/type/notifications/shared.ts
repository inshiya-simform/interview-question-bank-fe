import { z } from 'zod';
import { NOTIFICATION_TYPE } from '@/constants';

export const notificationTypeSchema = z.enum(NOTIFICATION_TYPE);

export const notificationSchema = z.object({
  id: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
  isRead: z.boolean(),
});

export type Notification = z.infer<typeof notificationSchema>;
