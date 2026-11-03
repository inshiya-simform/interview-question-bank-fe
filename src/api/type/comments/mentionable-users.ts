import { z } from 'zod';
import { mentionableUserSchema } from './shared';

export const mentionableUsersParamsSchema = z.object({ q: z.string().optional() });

export const mentionableUsersResponseSchema = z.object({ items: z.array(mentionableUserSchema) });

export type MentionableUsersParams = z.infer<typeof mentionableUsersParamsSchema>;
export type MentionableUsersResponse = z.infer<typeof mentionableUsersResponseSchema>;
