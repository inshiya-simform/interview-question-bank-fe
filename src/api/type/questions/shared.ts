import { z } from 'zod';
import { reviewInfoSchema, reviewLockSchema } from '../reviews/shared';

export const questionClientSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const questionSchema = z.object({
  id: z.string(),
  text: z.string(),
  answerNotes: z.string(),
  client: questionClientSchema.nullish(),
  // Tag names grouped by category slug.
  tags: z.record(z.string(), z.array(z.string())),
  // Present only for people allowed to see review state.
  review: reviewInfoSchema.nullish(),
  // Only sent to reviewers.
  reviewLock: reviewLockSchema.nullish(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Question = z.infer<typeof questionSchema>;
