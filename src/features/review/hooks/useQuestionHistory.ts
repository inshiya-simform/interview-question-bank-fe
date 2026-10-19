import { useQuestionHistoryQuery } from '@/api/hooks';
import { useSession } from '@/features/auth';

export function useQuestionHistory(questionId: string) {
  const { user } = useSession();
  const { data, isPending, isError } = useQuestionHistoryQuery(user?.id, questionId);

  return { entries: data?.history ?? [], isLoading: isPending, isError };
}
