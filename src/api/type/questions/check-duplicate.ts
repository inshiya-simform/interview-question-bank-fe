import { z } from 'zod';

export const checkDuplicatePayloadSchema = z.object({
  text: z.string(),
  // Omitted for an unrestricted question, which is compared with unrestricted questions only.
  clientId: z.string().optional(),
  // The question being edited, so it never matches itself.
  excludeId: z.string().optional(),
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
