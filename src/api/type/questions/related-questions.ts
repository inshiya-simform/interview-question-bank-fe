import { z } from 'zod';

export const relatedQuestionTagSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export const relatedQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  sharedTagCount: z.number().int(),
  tags: z.array(relatedQuestionTagSchema),
  commentCount: z.number().int(),
});

// `items` arrive ranked best match first and must be rendered in that order.
export const relatedQuestionsResponseSchema = z.object({
  items: z.array(relatedQuestionSchema),
});

export type RelatedQuestion = z.infer<typeof relatedQuestionSchema>;
export type RelatedQuestionsResponse = z.infer<typeof relatedQuestionsResponseSchema>;
