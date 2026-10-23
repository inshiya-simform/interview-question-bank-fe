import type { Question, TagCategory, CreateQuestionPayload } from '@/api';
import { htmlToText } from '@/utils/htmlToText';
import { normalizeAnswerHtml, toPayloadHtml } from '@/utils/richText';
import type { QuestionFormValues } from './schema';

export function buildQuestionPayload(values: QuestionFormValues): CreateQuestionPayload {
  return {
    text: values.question,
    answerNotes: toPayloadHtml(values.answer, htmlToText(values.answer)),
    clientId: values.clientId || undefined,
    confirmDistinct: values.confirmDistinct || undefined,
    distinctReason: values.confirmDistinct ? values.distinctReason : undefined,
    tags: values.categories.map(({ category, tags }) => ({
      categoryId: Number(category),
      tagIds: tags.map(Number),
    })),
  };
}

const matches = (key: string, item: { slug: string; name: string }) =>
  key.toLowerCase() === item.slug.toLowerCase() || key.toLowerCase() === item.name.toLowerCase();

// The API returns tag names grouped by category key, while the form works with ids.
export function buildInitialValues(
  question: Pick<Question, 'text' | 'answerNotes' | 'tags' | 'client'>,
  categories: TagCategory[],
): QuestionFormValues {
  const rows = Object.entries(question.tags).flatMap(([categoryKey, tagKeys]) => {
    const category = categories.find((item) => matches(categoryKey, item));
    if (!category) return [];
    const tags = category.tags
      .filter((tag) => tagKeys.some((key) => matches(key, tag)))
      .map(({ id }) => String(id));
    return [{ category: String(category.id), tags }];
  });

  return {
    question: question.text,
    answer: normalizeAnswerHtml(question.answerNotes),
    categories: rows.length > 0 ? rows : [{ category: '', tags: [] }],
    clientId: question.client?.id ?? '',
  };
}
