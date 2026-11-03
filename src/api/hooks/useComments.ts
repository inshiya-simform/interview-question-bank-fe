import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { COMMENT_PAGE_SIZE, REPLY_PAGE_SIZE } from '@/constants';
import type { CommentSort } from '@/constants';
import { appendReply, findCachedComment, patchComment, removeReply } from '../comment-cache';
import { QUERY_KEYS } from '../query-keys';
import { SILENT_ERROR_META } from '../query-meta';
import {
  createComment,
  deleteComment,
  getComments,
  getMentionableUsers,
  getReplies,
  updateComment,
  voteComment,
} from '../service/comments.service';
import type { CreateCommentPayload, UpdateCommentPayload } from '../type/comments/comment-payload';
import type { VoteCommentPayload } from '../type/comments/vote-comment';

const VOTE_MUTATION_KEY = ['comment-vote'] as const;

// Failures are mapped to specific toasts and inline states by the discussion feature.
export function useCommentsQuery(
  userId: string | undefined,
  questionId: string,
  sort: CommentSort,
) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.COMMENTS(userId ?? '', questionId, sort),
    queryFn: ({ pageParam, signal }) =>
      getComments(questionId, { sort, page: pageParam, limit: COMMENT_PAGE_SIZE }, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page * last.limit < last.total ? last.page + 1 : undefined),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
    meta: SILENT_ERROR_META,
  });
}

// Replies after a thread's preview: the endpoint starts at the oldest reply and pages by an opaque
// cursor, so what it returns supersedes the preview. Off until the viewer asks for more.
export function useRepliesQuery(
  userId: string | undefined,
  questionId: string,
  commentId: string,
  enabled: boolean,
) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.REPLIES(userId ?? '', questionId, commentId),
    queryFn: ({ pageParam, signal }) =>
      getReplies(questionId, commentId, { cursor: pageParam, limit: REPLY_PAGE_SIZE }, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: enabled && Boolean(userId),
    meta: SILENT_ERROR_META,
  });
}

// Typed text goes to the API, which only ever returns people who can see this question.
export function useMentionableUsersQuery(
  userId: string | undefined,
  questionId: string,
  search: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: QUERY_KEYS.MENTIONABLE_USERS(userId ?? '', questionId, search),
    queryFn: ({ signal }) => getMentionableUsers(questionId, { q: search }, signal),
    enabled: enabled && Boolean(userId),
    placeholderData: keepPreviousData,
    meta: SILENT_ERROR_META,
  });
}

function useInvalidateDiscussion() {
  const queryClient = useQueryClient();
  return {
    // Counts only: the thread list itself is patched in place.
    questions: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
    all: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS_LIST }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPLIES_LIST }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTIONS_LIST }),
      ]),
  };
}

export function useCreateCommentMutation(questionId: string) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateDiscussion();
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => createComment(questionId, payload),
    meta: SILENT_ERROR_META,
    // A reply is appended where it will be read; refetching the list would cut it back to the
    // preview. A new thread has no such place, so the list is refetched.
    onSuccess: (comment) => {
      if (comment.parentId === null) return invalidate.all();
      appendReply(queryClient, comment);
      return invalidate.questions();
    },
  });
}

export function useUpdateCommentMutation(questionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, payload }: { commentId: string; payload: UpdateCommentPayload }) =>
      updateComment(questionId, commentId, payload),
    meta: SILENT_ERROR_META,
    // The response is the whole comment, which replaces whatever copies are cached.
    onSuccess: (comment) => patchComment(queryClient, comment.id, comment),
  });
}

export function useDeleteCommentMutation(questionId: string) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateDiscussion();
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; parentId: string | null }) =>
      deleteComment(questionId, commentId),
    meta: SILENT_ERROR_META,
    onSuccess: (_result, { commentId, parentId }) => {
      if (parentId === null) return invalidate.all();
      removeReply(queryClient, { id: commentId, parentId });
      return invalidate.questions();
    },
  });
}

// Optimistic: the arrow and score move at once, the response reconciles them and an error puts
// the previous state back. Lists are never re-sorted here; that waits for the next fetch.
export function useVoteCommentMutation(questionId: string) {
  const queryClient = useQueryClient();
  const isOnlyVote = () => queryClient.isMutating({ mutationKey: VOTE_MUTATION_KEY }) <= 1;

  return useMutation({
    mutationKey: VOTE_MUTATION_KEY,
    mutationFn: ({ commentId, value }: { commentId: string } & VoteCommentPayload) =>
      voteComment(questionId, commentId, { value }),
    meta: SILENT_ERROR_META,
    onMutate: async ({ commentId, value }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.COMMENTS_LIST });
      const previous = findCachedComment(queryClient, commentId);
      if (previous) {
        patchComment(queryClient, commentId, {
          myVote: value,
          score: previous.score - previous.myVote + value,
        });
      }
      return { previous };
    },
    // With several votes in flight the last response wins, so earlier ones must not overwrite it.
    onSuccess: (result, { commentId }) => {
      if (isOnlyVote()) patchComment(queryClient, commentId, result);
    },
    onError: (_error, { commentId }, context) => {
      if (context?.previous && isOnlyVote()) {
        const { score, myVote } = context.previous;
        patchComment(queryClient, commentId, { score, myVote });
      }
    },
  });
}
