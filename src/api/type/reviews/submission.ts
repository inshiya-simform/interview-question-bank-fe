import { z } from 'zod';
import {
  historyEntrySchema,
  reviewContentSchema,
  reviewDecisionSchema,
  reviewKindSchema,
  reviewPersonSchema,
  reviewStatusSchema,
} from './shared';

// One item in a review queue or in a user's own submissions.
export const submissionSchema = z.object({
  id: z.string(),
  kind: reviewKindSchema,
  status: reviewStatusSchema,
  submitter: reviewPersonSchema,
  submittedAt: z.string(),
  // What awaits review (or was last reviewed).
  content: reviewContentSchema,
  // The version everyone currently reads, when one exists.
  live: reviewContentSchema.nullish(),
  decision: reviewDecisionSchema.nullish(),
  // Newest first.
  history: z.array(historyEntrySchema),
});

export type Submission = z.infer<typeof submissionSchema>;
