import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRelatedQuestionsQuery } from '@/api/hooks';
import { isNotFoundError } from '@/api/errors';
import { QUERY_KEYS } from '@/api/query-keys';
import { useSession } from '@/features/auth';

export function useRelatedQuestions(questionId: string) {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const query = useRelatedQuestionsQuery(user?.id, questionId);

  // The question page owns the not-found state; refetching the question flips it there.
  const isNotFound = isNotFoundError(query.error);
  useEffect(() => {
    if (!isNotFound || !user) return;
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTION_ITEM(user.id, questionId) });
  }, [isNotFound, user, questionId, queryClient]);

  return {
    related: query.data?.items ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    hasData: query.data !== undefined,
    refetch: () => void query.refetch(),
  };
}
