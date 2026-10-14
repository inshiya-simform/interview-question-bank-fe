import { z } from 'zod';
import { createQuestionPayloadSchema } from './create-question';
import { questionSchema } from './shared';

export const updateQuestionPayloadSchema = createQuestionPayloadSchema.pick({
  text: true,
  answerNotes: true,
  clientId: true,
  tags: true,
});

export const updateQuestionResponseSchema = questionSchema;

export type UpdateQuestionPayload = z.infer<typeof updateQuestionPayloadSchema>;
export type UpdateQuestionResponse = z.infer<typeof updateQuestionResponseSchema>;
