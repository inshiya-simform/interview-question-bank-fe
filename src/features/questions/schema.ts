import { z } from 'zod';
import { MESSAGES } from '@/constants';

export const categoryTagsSchema = z.object({
  category: z.string().min(1, MESSAGES.CATEGORY_REQUIRED),
  tags: z.array(z.string()),
});

export const addQuestionSchema = z.object({
  question: z.string().trim().min(1, MESSAGES.QUESTION_TEXT_REQUIRED),
  answer: z.string().trim().min(1, MESSAGES.ANSWER_REQUIRED),
  categories: z.array(categoryTagsSchema).min(1, MESSAGES.CATEGORY_REQUIRED),
  clients: z.array(z.string()),
});

export type CategoryTags = z.infer<typeof categoryTagsSchema>;
export type AddQuestionValues = z.infer<typeof addQuestionSchema>;
export type Question = AddQuestionValues & { id: string };
