import { z } from 'zod';

export const checkDuplicatePayloadSchema = z.object({
  text: z.string(),
});

export const duplicateMatchSchema = z.object({
  id: z.uuid(),
  text: z.string(),
  similarity: z.number().min(0).max(1),
});

export const checkDuplicateResponseSchema = z.object({
  isDuplicate: z.boolean(),
  matches: z.array(duplicateMatchSchema),
});

export type CheckDuplicatePayload = z.infer<typeof checkDuplicatePayloadSchema>;
export type DuplicateMatch = z.infer<typeof duplicateMatchSchema>;
export type CheckDuplicateResponse = z.infer<typeof checkDuplicateResponseSchema>;
