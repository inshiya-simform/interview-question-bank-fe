import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../query-keys';
import { SILENT_ERROR_META } from '../query-meta';
import {
  createCollection,
  deleteCollection,
  getCollections,
  getSavedQuestions,
  renameCollection,
  saveQuestion,
  unsaveQuestion,
} from '../service/collections.service';
import type { CollectionRef } from '../type/collections/shared';
import type { CollectionPayload } from '../type/collections/shared';
import type { SavedQuestionListParams } from '../type/collections/saved-questions';
import { questionListResponseSchema } from '../type/questions/questions-list';

export function useCollectionsQuery(userId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.COLLECTIONS(userId ?? ''),
    queryFn: getCollections,
    enabled: Boolean(userId) && enabled,
  });
}

export function useSavedQuestionsQuery(
  userId: string | undefined,
  params: SavedQuestionListParams,
) {
  return useQuery({
    queryKey: QUERY_KEYS.SAVED_QUESTIONS(userId ?? '', params),
    queryFn: () => getSavedQuestions(params),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

// Updates `savedIn` on cached question lists so the row changes without a per-row request.
function patchSavedIn(queryClient: QueryClient, questionId: string, savedIn: CollectionRef | null) {
  queryClient.setQueriesData({ queryKey: QUERY_KEYS.QUESTIONS_LIST }, (old: unknown) => {
    const list = questionListResponseSchema.safeParse(old);
    if (!list.success) return old;
    return {
      ...list.data,
      questions: list.data.questions.map((question) =>
        question.id === questionId ? { ...question, savedIn } : question,
      ),
    };
  });
}

function refreshSaved(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COLLECTIONS_LIST }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SAVED_QUESTIONS_LIST }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
  ]);
}

// 409 (name taken / limit reached) is shown inline by the form, so it is not toasted centrally.
export function useCreateCollectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollection,
    meta: SILENT_ERROR_META,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COLLECTIONS_LIST }),
  });
}

export function useRenameCollectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CollectionPayload }) =>
      renameCollection(id, payload),
    meta: SILENT_ERROR_META,
    onSuccess: () => refreshSaved(queryClient),
  });
}

export function useDeleteCollectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () =>
      Promise.all([
        // The open view is the deleted collection, which would now 404 on refetch. The page
        // navigates to "All saved" next, so stale saved lists are refreshed when they mount.
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.SAVED_QUESTIONS_LIST,
          refetchType: 'none',
        }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COLLECTION_LIST }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
      ]),
  });
}

export function useSaveQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, collectionId }: { questionId: string; collectionId: string }) =>
      saveQuestion(questionId, { collectionId }),
    onSuccess: (saved) => {
      patchSavedIn(queryClient, saved.questionId, saved.savedIn);
      return refreshSaved(queryClient);
    },
  });
}

export function useUnsaveQuestionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unsaveQuestion,
    onSuccess: (_result, questionId) => {
      patchSavedIn(queryClient, questionId, null);
      return refreshSaved(queryClient);
    },
  });
}
