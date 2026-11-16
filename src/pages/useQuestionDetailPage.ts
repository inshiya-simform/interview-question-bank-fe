import { useParams } from 'react-router-dom';
import { useQuestionQuery } from '@/api/hooks';
import { isNotFoundError } from '@/api/errors';
import { QUESTION_ID_PARAM } from '@/constants';
import { useSession } from '@/features/auth';
import { useQuestionsHome } from '@/features/questions';
import { usePermissions } from '@/hooks/usePermissions';
import { canViewQuestionHistory } from '@/utils/permissions';

export function useQuestionDetailPage() {
  const questionId = useParams()[QUESTION_ID_PARAM] ?? null;
  const { user } = useSession();
  const query = useQuestionQuery(user?.id, questionId);
  const { permissions } = usePermissions();
  const home = useQuestionsHome();

  return {
    ...home,
    questionId,
    question: query.data,
    canViewHistory: query.data ? canViewQuestionHistory(user, permissions, query.data) : false,
    // Also true when the discussion reported the question gone and the refetch confirmed it.
    isNotFound: isNotFoundError(query.error),
    isLoading: query.isPending,
    isError: query.isError,
    refetch: () => void query.refetch(),
  };
}
