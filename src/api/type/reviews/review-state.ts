import { z } from 'zod';
import { reviewLockSchema, reviewStatusSchema } from './shared';

// Returned by both the review-state read and the lock claim/heartbeat.
export const reviewStateSchema = z.object({
  status: reviewStatusSchema,
  updatedAt: z.string(),
  reviewLock: reviewLockSchema.nullable(),
});

export type ReviewState = z.infer<typeof reviewStateSchema>;
