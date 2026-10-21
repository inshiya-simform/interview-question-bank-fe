import { z } from 'zod';
import { rejectPayloadSchema } from './review-decision';

export const bulkApprovePayloadSchema = z.object({ ids: z.array(z.string()).min(1) });
export const bulkRejectPayloadSchema = bulkApprovePayloadSchema.extend(rejectPayloadSchema.shape);

// `code` stays a plain string so a code the API adds later still parses.
export const bulkDecisionResponseSchema = z.object({
  succeeded: z.array(z.string()),
  failed: z.array(z.object({ id: z.string(), code: z.string(), message: z.string() })),
});

export type BulkApprovePayload = z.infer<typeof bulkApprovePayloadSchema>;
export type BulkRejectPayload = z.infer<typeof bulkRejectPayloadSchema>;
export type BulkDecisionResponse = z.infer<typeof bulkDecisionResponseSchema>;
