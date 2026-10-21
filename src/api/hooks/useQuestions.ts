import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import {
  approveQuestion,
  bulkApproveQuestions,
  bulkRejectQuestions,
  checkDuplicateQuestion,
  createQuestion,
  exportQuestions,
  getQuestion,
  getQuestionCounts,
  getQuestionHistory,
  getSubmissions,
  getQuestions,
  rejectQuestion,
  requestQuestionChanges,
  updateQuestion,
} from '../service/questions.service';
import type { RejectPayload, RequestChangesPayload } from '../type/reviews/review-decision';
import type { SubmissionListParams } from '../type/reviews/submission-list';
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

// POST is used as a read-only check, so it is modelled as a query.
export function useCheckDuplicateQuery(userId: string | undefined, text: string, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.DUPLICATE_CHECK(userId ?? '', text),
    queryFn: () => checkDuplicateQuestion({ text }),
    enabled: enabled && Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

export function useQuestionCountsQuery(userId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.QUESTION_COUNTS(userId ?? ''),
    queryFn: getQuestionCounts,
    enabled: enabled && Boolean(userId),
  });
}

export function useSubmissionsQuery(userId: string | undefined, params: SubmissionListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.SUBMISSIONS(userId ?? '', params),
    queryFn: () => getSubmissions(params),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

export function useQuestionHistoryQuery(userId: string | undefined, id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.QUESTION_HISTORY(userId ?? '', id ?? ''),
    queryFn: () => getQuestionHistory(id ?? ''),
    enabled: Boolean(userId) && id !== null,
  });
}

// Every decision changes status, counts and history, all under the questions prefix.
export function useApproveQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveQuestion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
  });
}

export function useRequestChangesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RequestChangesPayload }) =>
      requestQuestionChanges(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
  });
}

export function useRejectQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectPayload }) =>
      rejectQuestion(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
  });
}

// Partial success is still a 2xx, so refresh the lists whichever ids went through.
export function useBulkApproveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkApproveQuestions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
  });
}

export function useBulkRejectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkRejectQuestions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
  });
}

// A download is a user-triggered action, so it is a mutation rather than a cached query.
export function useExportQuestionsMutation() {
  return useMutation({ mutationFn: exportQuestions });
}
