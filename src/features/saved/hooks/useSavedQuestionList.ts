import { useEffect } from 'react';
import { useSavedQuestionsQuery } from '@/api/hooks';
import { SAVED_PAGE_SIZE } from '@/constants';
import { useSession } from '@/features/auth';

interface UseSavedQuestionListArgs {
  collectionId?: string;
  page: number;
  onPageChange: (page: number) => void;
}

export function useSavedQuestionList({
  collectionId,
  page,
  onPageChange,
}: UseSavedQuestionListArgs) {
  const { user } = useSession();
  const query = useSavedQuestionsQuery(user?.id, { collectionId, page, limit: SAVED_PAGE_SIZE });

  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / SAVED_PAGE_SIZE));

  // Unsaving the last card on a page leaves it empty; step back to the last page that exists.
  useEffect(() => {
    if (query.data && !query.isPlaceholderData && page > totalPages) onPageChange(totalPages);
  }, [query.data, query.isPlaceholderData, page, totalPages, onPageChange]);

  return {
    questions: query.data?.questions ?? [],
    totalPages,
    isLoading: query.isPending,
    isError: query.isError,
    hasData: query.data !== undefined,
    refetch: () => void query.refetch(),
  };
}
