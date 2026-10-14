import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import {
  createQuestion,
  getQuestion,
  getQuestions,
  updateQuestion,
} from '../service/questions.service';
import type { UpdateQuestionPayload } from '../type/questions/update-question';
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

export function useUpdateQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateQuestionPayload }) =>
      updateQuestion(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
  });
}

export function useQuestionQuery(userId: string | undefined, id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.QUESTION_ITEM(userId ?? '', id ?? ''),
    queryFn: () => getQuestion(id ?? ''),
    enabled: Boolean(userId) && id !== null,
  });
}
