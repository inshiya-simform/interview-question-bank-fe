import { z } from 'zod';
import { REVIEW_STATUS } from '@/constants';

export const reviewStatusSchema = z.enum(REVIEW_STATUS);

export const reviewPersonSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// The reviewer's note (request changes) or reason (reject) shown to the submitter.
export const reviewDecisionSchema = z.object({
  note: z.string().nullish(),
  decidedBy: reviewPersonSchema,
  decidedAt: z.string(),
});

// The editable content of a question, as submitted or as live.
export const reviewContentSchema = z.object({
  text: z.string(),
  answerNotes: z.string(),
  client: z.object({ id: z.string(), name: z.string() }).nullish(),
  // Tag names grouped by category slug.
  tags: z.record(z.string(), z.array(z.string())),
});

// Review state attached to a question, only for people allowed to see it.
export const reviewInfoSchema = z.object({
  status: reviewStatusSchema,
  isLive: z.boolean(),
  revision: reviewContentSchema.nullish(),
  decision: reviewDecisionSchema.nullish(),
});

export type ReviewPerson = z.infer<typeof reviewPersonSchema>;
export type ReviewDecision = z.infer<typeof reviewDecisionSchema>;
export type ReviewContent = z.infer<typeof reviewContentSchema>;
export type ReviewInfo = z.infer<typeof reviewInfoSchema>;
