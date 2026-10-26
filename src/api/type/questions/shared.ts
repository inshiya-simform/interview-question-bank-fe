import { z } from 'zod';
import { collectionRefSchema } from '../collections/shared';
import { duplicateOverrideSchema, reviewInfoSchema, reviewLockSchema } from '../reviews/shared';

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
  duplicateOverride: duplicateOverrideSchema.nullish(),
  // The viewer's own collection for this question; null when it is not saved.
  savedIn: collectionRefSchema.nullish(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Question = z.infer<typeof questionSchema>;
