import type { CreateQuestionPayload } from '@/api';
import type { AddQuestionValues } from './schema';

export function buildCreateQuestionPayload(values: AddQuestionValues): CreateQuestionPayload {
  return {
    text: values.question,
    answerNotes: values.answer,
    clientId: values.clientId || undefined,
    tags: values.categories.map(({ category, tags }) => ({
      categoryId: Number(category),
      tagIds: tags.map(Number),
    })),
  };
}
