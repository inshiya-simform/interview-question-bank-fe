import { z } from 'zod';
import { rejectPayloadSchema } from './review-decision';

// Maps each question id to the updatedAt the reviewer saw.
const expectedUpdatedAtSchema = z.record(z.string(), z.string()).optional();

export const bulkApprovePayloadSchema = z.object({
  ids: z.array(z.string()).min(1),
  expectedUpdatedAt: expectedUpdatedAtSchema,
});
export const bulkRejectPayloadSchema = bulkApprovePayloadSchema.extend({
  note: rejectPayloadSchema.shape.note,
});

// `code` stays a plain string so a code the API adds later still parses.
export const bulkDecisionResponseSchema = z.object({
  succeeded: z.array(z.string()),
  failed: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      message: z.string(),
      details: z.looseObject({ reason: z.string().optional() }).optional(),
    }),
  ),
});

export type BulkApprovePayload = z.infer<typeof bulkApprovePayloadSchema>;
export type BulkRejectPayload = z.infer<typeof bulkRejectPayloadSchema>;
export type BulkDecisionResponse = z.infer<typeof bulkDecisionResponseSchema>;
