import { z } from 'zod';

export const markReadResponseSchema = z.object({ unreadCount: z.number().int() });
export const markAllReadResponseSchema = z.object({ unreadCount: z.number().int() });

export type MarkReadResponse = z.infer<typeof markReadResponseSchema>;
export type MarkAllReadResponse = z.infer<typeof markAllReadResponseSchema>;
