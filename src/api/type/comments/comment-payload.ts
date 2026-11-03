import { z } from 'zod';
import { COMMENT_MAX_LENGTH, COMMENT_MAX_MENTIONS, MESSAGES } from '@/constants';

const bodySchema = z
  .string()
  .min(1, MESSAGES.COMMENT_REQUIRED)
  .max(COMMENT_MAX_LENGTH, MESSAGES.COMMENT_TOO_LONG);
const mentionsSchema = z.array(z.uuid()).max(COMMENT_MAX_MENTIONS);

export const createCommentPayloadSchema = z.object({
  body: bodySchema,
  mentions: mentionsSchema.optional(),
  parentId: z.uuid().optional(),
});

// The API rejects `parentId` on edit, so the edit payload cannot carry it.
export const updateCommentPayloadSchema = z.object({
  body: bodySchema,
  mentions: mentionsSchema.optional(),
});

export type CreateCommentPayload = z.infer<typeof createCommentPayloadSchema>;
export type UpdateCommentPayload = z.infer<typeof updateCommentPayloadSchema>;
