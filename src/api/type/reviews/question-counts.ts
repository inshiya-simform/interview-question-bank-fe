import { z } from 'zod';
import { reviewStatusSchema } from './shared';

export const questionCountsResponseSchema = z.object({
  counts: z.record(reviewStatusSchema, z.number()),
});

export type QuestionCountsResponse = z.infer<typeof questionCountsResponseSchema>;
