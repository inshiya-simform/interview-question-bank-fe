import { z } from 'zod';
import { questionSchema } from './shared';

// Outbound query params: validated before sending. Tag/category ids are numeric in the API.
export const questionListParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
  clientId: z.uuid().optional(),
  tags: z.array(z.number().int().positive()).optional(),
  categories: z.array(z.number().int().positive()).optional(),
  search: z.string().optional(),
});

export const questionListResponseSchema = z.object({
  questions: z.array(questionSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type QuestionListParams = z.infer<typeof questionListParamsSchema>;
export type QuestionListResponse = z.infer<typeof questionListResponseSchema>;
