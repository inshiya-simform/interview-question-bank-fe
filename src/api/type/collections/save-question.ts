import { z } from 'zod';
import { collectionRefSchema } from './shared';

export const saveQuestionPayloadSchema = z.object({
  collectionId: z.string().min(1),
});

export const saveQuestionResponseSchema = z.object({
  questionId: z.string(),
  savedIn: collectionRefSchema,
  savedAt: z.string(),
});

export type SaveQuestionPayload = z.infer<typeof saveQuestionPayloadSchema>;
export type SaveQuestionResponse = z.infer<typeof saveQuestionResponseSchema>;
