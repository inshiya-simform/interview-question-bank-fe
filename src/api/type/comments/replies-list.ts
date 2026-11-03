import { z } from 'zod';
import { commentSchema } from './shared';

export const replyListParamsSchema = z.object({
  // Opaque: only ever the `nextCursor` of the previous page.
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export const listRepliesResponseSchema = z.object({
  items: z.array(commentSchema),
  nextCursor: z.string().nullable(),
});

export type ReplyListParams = z.infer<typeof replyListParamsSchema>;
export type ListRepliesResponse = z.infer<typeof listRepliesResponseSchema>;
