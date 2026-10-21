import { z } from 'zod';
import { MESSAGES, REVIEW_NOTE_MAX_LENGTH } from '@/constants';

// Request changes needs a note; reject takes an optional reason.
export const requestChangesFormSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, MESSAGES.CHANGE_NOTE_REQUIRED)
    .max(REVIEW_NOTE_MAX_LENGTH, MESSAGES.CHANGE_NOTE_TOO_LONG),
});

export const rejectFormSchema = z.object({
  text: z.string().trim().max(REVIEW_NOTE_MAX_LENGTH, MESSAGES.REJECT_REASON_TOO_LONG),
});

export type DecisionNoteValues = z.infer<typeof requestChangesFormSchema>;

// Lets the API reject a decision made on content edited since the reviewer loaded it.
const expectedUpdatedAtShape = { expectedUpdatedAt: z.string().optional() };

export const approvePayloadSchema = z.object(expectedUpdatedAtShape);
export const requestChangesPayloadSchema = z.object({
  note: requestChangesFormSchema.shape.text,
  ...expectedUpdatedAtShape,
});
export const rejectPayloadSchema = z.object({
  note: rejectFormSchema.shape.text,
  ...expectedUpdatedAtShape,
});

export type ApprovePayload = z.infer<typeof approvePayloadSchema>;

export type RequestChangesPayload = z.infer<typeof requestChangesPayloadSchema>;
export type RejectPayload = z.infer<typeof rejectPayloadSchema>;
