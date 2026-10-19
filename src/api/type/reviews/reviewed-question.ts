import { z } from 'zod';
import { questionClientSchema } from '../questions/shared';
import { reviewContentSchema, reviewPersonSchema, reviewStatusSchema } from './shared';

// Full question as returned by the review decision endpoints.
export const reviewedQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  answerNotes: z.string(),
  client: questionClientSchema.nullish(),
  tags: z.record(z.string(), z.array(z.string())),
  authorId: z.string(),
  status: reviewStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  author: reviewPersonSchema,
  isLive: z.boolean(),
  submittedAt: z.string().nullish(),
  reviewNote: z.string().nullish(),
  reviewedBy: reviewPersonSchema.nullish(),
  reviewedAt: z.string().nullish(),
  hasDraft: z.boolean(),
  // Pending edit of a live question.
  draft: reviewContentSchema.nullish(),
});

export type ReviewedQuestion = z.infer<typeof reviewedQuestionSchema>;
