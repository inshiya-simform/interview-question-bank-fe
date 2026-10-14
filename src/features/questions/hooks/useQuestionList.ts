import { useQuestionsQuery } from '@/api/hooks';
import { QUESTIONS_PAGE_SIZE } from '@/constants';
import { useSession } from '@/features/auth';
import { toListParams } from '../filters';
import { useQuestionFilters } from './useQuestionFilters';
import { useQuestionOptions } from './useQuestionOptions';

export function useQuestionList() {
  const { user } = useSession();
  const filterState = useQuestionFilters();
  const options = useQuestionOptions();
  const query = useQuestionsQuery(user?.id, toListParams(filterState.filters));

  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / QUESTIONS_PAGE_SIZE));

  return {
    ...filterState,
    options,
    questions: query.data?.questions ?? [],
    total,
    totalPages,
    isLoading: query.isPending,
    isError: query.isError,
    hasData: query.data !== undefined,
    refetch: () => void query.refetch(),
  };
}
