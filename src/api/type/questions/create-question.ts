import { z } from 'zod';
import { questionSchema } from './shared';

export const createQuestionPayloadSchema = z.object({
  text: z.string(),
  answerNotes: z.string(),
  clientId: z.string().optional(),
  tags: z.array(z.object({ categoryId: z.number(), tagIds: z.array(z.number()) })),
  // Duplicate-override fields; the API decides how they are recorded.
  confirmDistinct: z.boolean().optional(),
  distinctReason: z.string().optional(),
});

export const createQuestionResponseSchema = questionSchema;

export type CreateQuestionPayload = z.infer<typeof createQuestionPayloadSchema>;
export type CreateQuestionResponse = z.infer<typeof createQuestionResponseSchema>;
