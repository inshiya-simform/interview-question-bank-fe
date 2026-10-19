import { z } from 'zod';
import { reviewedQuestionSchema } from './reviewed-question';
import { reviewStatusSchema } from './shared';

// Outbound query params: validated before sending. The sort options are not documented yet,
// so sort is deliberately left out.
export const submissionListParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
  status: z.array(reviewStatusSchema).optional(),
});

export const submissionListResponseSchema = z.object({
  questions: z.array(reviewedQuestionSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type SubmissionListParams = z.infer<typeof submissionListParamsSchema>;
export type SubmissionListResponse = z.infer<typeof submissionListResponseSchema>;
