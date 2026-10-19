import { z } from 'zod';
import { reviewPersonSchema } from './shared';

export const questionHistoryEntrySchema = z.object({
  id: z.string(),
  // Kept as a string so a new backend action never breaks parsing.
  action: z.string(),
  actor: reviewPersonSchema,
  createdAt: z.string(),
});

export const questionHistoryResponseSchema = z.object({
  history: z.array(questionHistoryEntrySchema),
});

export type QuestionHistoryEntry = z.infer<typeof questionHistoryEntrySchema>;
export type QuestionHistoryResponse = z.infer<typeof questionHistoryResponseSchema>;
