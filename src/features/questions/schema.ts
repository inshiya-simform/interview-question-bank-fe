import { z } from 'zod';
import { MESSAGES } from '@/constants';

// Form values hold option ids as strings (native select/checkbox values).
export const categoryTagsSchema = z.object({
  category: z.string().min(1, MESSAGES.CATEGORY_REQUIRED),
  tags: z.array(z.string()),
});

export const questionFormSchema = z
  .object({
    question: z.string().trim().min(1, MESSAGES.QUESTION_TEXT_REQUIRED),
    answer: z.string().trim().min(1, MESSAGES.ANSWER_REQUIRED),
    categories: z.array(categoryTagsSchema).min(1, MESSAGES.CATEGORY_REQUIRED),
    clientId: z.string(),
    // Set when the author confirms the question differs from the listed duplicates.
    confirmDistinct: z.boolean().optional(),
    distinctReason: z.string().trim().optional(),
  })
  .superRefine((values, context) => {
    if (values.confirmDistinct && !values.distinctReason) {
      context.addIssue({
        code: 'custom',
        path: ['distinctReason'],
        message: MESSAGES.DISTINCT_REASON_REQUIRED,
      });
    }
  });

export type CategoryTags = z.infer<typeof categoryTagsSchema>;
export type QuestionFormValues = z.infer<typeof questionFormSchema>;
