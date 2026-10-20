import { z } from 'zod';
import { importRowErrorSchema } from './shared';

export const importQuestionsPayloadSchema = z.object({
  file: z.instanceof(File),
});

export const importQuestionsResponseSchema = z.object({
  imported: z.number().int().min(0),
  questions: z.array(z.object({ id: z.string(), text: z.string() })),
});

// Error body of a rejected file; parsed from ApiError.body, never from a success response.
export const importValidationErrorBodySchema = z.looseObject({
  error: z.looseObject({
    details: z.array(importRowErrorSchema).min(1),
  }),
});

export type ImportQuestionsPayload = z.infer<typeof importQuestionsPayloadSchema>;
export type ImportQuestionsResponse = z.infer<typeof importQuestionsResponseSchema>;
