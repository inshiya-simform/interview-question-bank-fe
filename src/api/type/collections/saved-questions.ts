import { z } from 'zod';
import { questionSchema } from '../questions/shared';
import { collectionRefSchema } from './shared';

export const savedQuestionSchema = questionSchema.extend({
  savedIn: collectionRefSchema,
  savedAt: z.string(),
});

// Outbound query params: validated before sending. No collectionId means "All saved".
export const savedQuestionListParamsSchema = z.object({
  collectionId: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
});

export const savedQuestionListResponseSchema = z.object({
  questions: z.array(savedQuestionSchema),
  // The backend omits `count` here; the sidebar counts come from GET /collections.
  collection: collectionRefSchema.nullable(),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type SavedQuestion = z.infer<typeof savedQuestionSchema>;
export type SavedQuestionListParams = z.infer<typeof savedQuestionListParamsSchema>;
export type SavedQuestionListResponse = z.infer<typeof savedQuestionListResponseSchema>;
