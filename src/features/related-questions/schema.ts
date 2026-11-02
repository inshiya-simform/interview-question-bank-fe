import { z } from 'zod';

export const relatedQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  // Names of the tags this question has in common with the one being viewed.
  sharedTags: z.array(z.string()),
  commentCount: z.number().int(),
});

export type RelatedQuestion = z.infer<typeof relatedQuestionSchema>;
