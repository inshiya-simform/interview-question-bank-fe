import { z } from 'zod';
import { voteValueSchema } from './shared';

export const voteCommentPayloadSchema = z.object({ value: voteValueSchema });

export const voteCommentResponseSchema = z.object({
  score: z.number().int(),
  myVote: voteValueSchema,
});

export type VoteCommentPayload = z.infer<typeof voteCommentPayloadSchema>;
export type VoteCommentResponse = z.infer<typeof voteCommentResponseSchema>;
