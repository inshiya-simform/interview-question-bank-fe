import { z } from 'zod';
import { REVIEW_CONFLICT_REASON } from '@/constants';
import { reviewPersonSchema, reviewStatusSchema } from './shared';

export const reviewConflictDetailsSchema = z.discriminatedUnion('reason', [
  z.looseObject({
    reason: z.literal(REVIEW_CONFLICT_REASON.LOCKED),
    lockedBy: reviewPersonSchema,
    expiresAt: z.string(),
  }),
  z.looseObject({
    reason: z.literal(REVIEW_CONFLICT_REASON.ALREADY_REVIEWED),
    status: reviewStatusSchema,
    reviewedBy: reviewPersonSchema.nullable(),
    reviewedAt: z.string().nullish(),
  }),
  z.looseObject({ reason: z.literal(REVIEW_CONFLICT_REASON.EDITED_SINCE_LOADED) }),
]);

export const reviewConflictBodySchema = z.looseObject({
  error: z.looseObject({
    code: z.string(),
    message: z.string(),
    details: reviewConflictDetailsSchema,
  }),
});

export type ReviewConflictDetails = z.infer<typeof reviewConflictDetailsSchema>;
export type ReviewConflictBody = z.infer<typeof reviewConflictBodySchema>;
