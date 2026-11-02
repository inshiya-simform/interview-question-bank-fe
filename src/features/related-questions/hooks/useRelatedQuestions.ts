import { useQuery } from '@tanstack/react-query';
import type { Question } from '@/api';
import { QUERY_KEYS } from '@/api/query-keys';
import { useSession } from '@/features/auth';
import { getRelatedQuestions } from '../mock/relatedMock';

// Wraps the mock service the way api/hooks will wrap the real one.
export function useRelatedQuestions(question: Pick<Question, 'id' | 'tags'>) {
  const { user } = useSession();
  const query = useQuery({
    queryKey: QUERY_KEYS.RELATED_QUESTIONS(user?.id ?? '', question.id),
    queryFn: () => getRelatedQuestions(Object.values(question.tags).flat()),
    enabled: Boolean(user),
  });

  return {
    related: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    hasData: query.data !== undefined,
    refetch: () => void query.refetch(),
  };
}
