import { useParams } from 'react-router-dom';
import { useQuestionQuery } from '@/api/hooks';
import { QUESTION_ID_PARAM } from '@/constants';
import { useSession } from '@/features/auth';
import { useQuestionsHome } from '@/features/questions';

export function useQuestionDetailPage() {
  const questionId = useParams()[QUESTION_ID_PARAM] ?? null;
  const { user } = useSession();
  const query = useQuestionQuery(user?.id, questionId);
  const home = useQuestionsHome();

  return {
    ...home,
    questionId,
    question: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    refetch: () => void query.refetch(),
  };
}
