import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { createQuestion, getQuestions } from '../service/questions.service';
import type { QuestionListParams } from '../type/questions/questions-list';

export function useCreateQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
  });
}

export function useQuestionsQuery(userId: string | undefined, params: QuestionListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.QUESTIONS(userId ?? '', params),
    queryFn: () => getQuestions(params),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}
