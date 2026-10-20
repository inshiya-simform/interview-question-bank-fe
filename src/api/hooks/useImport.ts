import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { getImportTemplate, importQuestions } from '../service/import.service';

export function useImportQuestionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importQuestions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
  });
}

// A download is a user-triggered action, so it is a mutation rather than a cached query.
export function useDownloadImportTemplateMutation() {
  return useMutation({ mutationFn: getImportTemplate });
}
