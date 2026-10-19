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
