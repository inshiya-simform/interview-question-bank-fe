import { relatedQuestionSchema } from '../schema';
import type { RelatedQuestion } from '../schema';

// Stand-in for the related-questions API, which ranks by shared tags and only ever returns
// questions the viewer may see. The mock shares as many of the open question's own tags as each
// entry's `overlap` allows, so the card always agrees with the question beside it.
const MOCK_LATENCY_MS = 250;
const MAX_RELATED = 5;

const POOL = [
  {
    id: 'mock-related-1',
    text: 'How do you approach debugging an issue you cannot reproduce locally?',
    overlap: 4,
    commentCount: 11,
  },
  {
    id: 'mock-related-2',
    text: 'Describe a time you had to trade speed for quality.',
    overlap: 3,
    commentCount: 8,
  },
  {
    id: 'mock-related-3',
    text: 'What would you check first when a page becomes slow in production?',
    overlap: 2,
    commentCount: 6,
  },
  {
    id: 'mock-related-4',
    text: 'How do you decide what to cover with automated tests?',
    overlap: 2,
    commentCount: 4,
  },
  {
    id: 'mock-related-5',
    text: "Walk me through how you review a teammate's pull request.",
    overlap: 1,
    commentCount: 3,
  },
] as const;

export async function getRelatedQuestions(tagNames: readonly string[]): Promise<RelatedQuestion[]> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return POOL.map((entry) =>
    relatedQuestionSchema.parse({
      id: entry.id,
      text: entry.text,
      sharedTags: tagNames.slice(0, entry.overlap),
      commentCount: entry.commentCount,
    }),
  )
    .filter((related) => related.sharedTags.length > 0)
    .slice(0, MAX_RELATED);
}
