import { z } from 'zod';
import {
  ANSWER_HTML_MAX,
  ANSWER_TEXT_MAX,
  MESSAGES,
  QUESTION_TEXT_MAX_LENGTH,
  RICH_TEXT_COPY,
} from '@/constants';
import { htmlTextLength } from '@/utils/htmlToText';
import { hasLetterOrNumber } from '@/utils/validators';

// Form values hold option ids as strings (native select/checkbox values).
export const categoryTagsSchema = z.object({
  category: z.string().min(1, MESSAGES.CATEGORY_REQUIRED),
  tags: z.array(z.string()),
});

export const questionTextSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.QUESTION_TEXT_REQUIRED)
  .max(QUESTION_TEXT_MAX_LENGTH, MESSAGES.QUESTION_TEXT_TOO_LONG)
  .refine(hasLetterOrNumber, MESSAGES.QUESTION_TEXT_NO_ALPHANUMERIC);

export const questionFormSchema = z
  .object({
    question: questionTextSchema,
    answer: z
      .string()
      .refine((html) => htmlTextLength(html) > 0 || /<img\b/i.test(html), MESSAGES.ANSWER_REQUIRED)
      .refine((html) => htmlTextLength(html) <= ANSWER_TEXT_MAX, RICH_TEXT_COPY.TEXT_TOO_LONG)
      .refine((html) => html.length <= ANSWER_HTML_MAX, RICH_TEXT_COPY.HTML_TOO_LONG),
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

// Receives a failed save so the form can show field messages and duplicate matches inline.
export type SubmitErrorHandler = (error: unknown) => void;

export type CategoryTags = z.infer<typeof categoryTagsSchema>;
export type QuestionFormValues = z.infer<typeof questionFormSchema>;
