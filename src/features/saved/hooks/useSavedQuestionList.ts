import { SAVED_PAGE_SIZE } from '@/constants';
import { useSavedState } from './useSavedState';

interface UseSavedQuestionListArgs {
  collectionId?: string;
  page: number;
}

export function useSavedQuestionList({ collectionId, page }: UseSavedQuestionListArgs) {
  const { entries } = useSavedState();
  const matching = entries
    .filter((entry) => !collectionId || entry.collectionId === collectionId)
    .sort((a, b) => b.savedAt - a.savedAt);

  return {
    questions: matching
      .slice((page - 1) * SAVED_PAGE_SIZE, page * SAVED_PAGE_SIZE)
      .map((entry) => entry.question),
    totalPages: Math.max(1, Math.ceil(matching.length / SAVED_PAGE_SIZE)),
  };
}
