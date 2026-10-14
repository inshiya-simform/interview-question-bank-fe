import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { createQuestion } from '../service/questions.service';

export function useCreateQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
  });
}
