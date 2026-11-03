import { z } from 'zod';
import { COMMENT_SORT } from '@/constants';
import { threadSchema } from './shared';

export const commentListParamsSchema = z.object({
  sort: z.enum([COMMENT_SORT.TOP, COMMENT_SORT.NEWEST]).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
});

export const commentListResponseSchema = z.object({
  items: z.array(threadSchema),
  page: z.number(),
  limit: z.number(),
  // Threads, for pagination.
  total: z.number(),
  // Comments plus replies, for the discussion header.
  totalComments: z.number(),
});

export type CommentListParams = z.infer<typeof commentListParamsSchema>;
export type CommentListResponse = z.infer<typeof commentListResponseSchema>;
