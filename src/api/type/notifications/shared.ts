import { z } from 'zod';
import { NOTIFICATION_TYPE, SUBMISSION_REASON } from '@/constants';

export const notificationTypeSchema = z.enum(NOTIFICATION_TYPE);

// `type` stays a plain string so a type added by the backend later does not fail the whole page;
// use `parseNotificationPayload` to narrow to a known type and fall back otherwise.
export const notificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.string(), z.unknown()),
  read: z.boolean(),
  createdAt: z.string(),
});

export const unreadCountResponseSchema = z.object({ unreadCount: z.number().int() });

const clientAccessDataSchema = z.object({ clientId: z.string(), clientName: z.string() });
const questionRef = { questionId: z.string(), questionText: z.string() };

// Per-type `data` payloads, keyed by the discriminating `type`.
export const notificationPayloadSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(NOTIFICATION_TYPE.CLIENT_ACCESS_GRANTED),
    data: clientAccessDataSchema,
  }),
  z.object({
    type: z.literal(NOTIFICATION_TYPE.CLIENT_ACCESS_REVOKED),
    data: clientAccessDataSchema,
  }),
  z.object({
    type: z.literal(NOTIFICATION_TYPE.QUESTION_APPROVED),
    data: z.object({ ...questionRef, reviewerName: z.string(), isEdit: z.boolean() }),
  }),
  z.object({
    type: z.literal(NOTIFICATION_TYPE.QUESTION_CHANGES_REQUESTED),
    data: z.object({ ...questionRef, reviewerName: z.string(), note: z.string() }),
  }),
  z.object({
    type: z.literal(NOTIFICATION_TYPE.QUESTION_REJECTED),
    data: z.object({
      ...questionRef,
      reviewerName: z.string(),
      note: z.string().nullable(),
      isEdit: z.boolean(),
    }),
  }),
  z.object({
    type: z.literal(NOTIFICATION_TYPE.QUESTION_SUBMITTED),
    data: z.object({
      ...questionRef,
      submitterName: z.string(),
      reason: z.enum(SUBMISSION_REASON),
    }),
  }),
  z.object({
    type: z.literal(NOTIFICATION_TYPE.CLIENT_QUESTION_ADDED),
    data: z.object({
      ...questionRef,
      clientId: z.string(),
      clientName: z.string().nullable(),
    }),
  }),
  z.object({
    type: z.literal(NOTIFICATION_TYPE.IMPORT_FINISHED),
    data: z.object({ count: z.number() }),
  }),
]);

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type UnreadCountResponse = z.infer<typeof unreadCountResponseSchema>;
export type NotificationPayload = z.infer<typeof notificationPayloadSchema>;

// Null for an unknown type or a `data` shape that drifted: callers render a generic fallback.
export function parseNotificationPayload(
  notification: Pick<Notification, 'type' | 'data'>,
): NotificationPayload | null {
  const result = notificationPayloadSchema.safeParse(notification);
  return result.success ? result.data : null;
}
