import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getLostMentionIds } from '@/api';
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useVoteCommentMutation,
} from '@/api/hooks';
import { ApiError, getErrorMessage } from '@/api/errors';
import { QUERY_KEYS } from '@/api/query-keys';
import { DISCUSSION_COPY, HTTP_STATUS } from '@/constants';
import { useSession } from '@/features/auth';
import type { CommentActions } from '../schema';

// The discussion mutations are silent in the query client, so every failure is mapped here.
export function useCommentActions(questionId: string): CommentActions {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const create = useCreateCommentMutation(questionId);
  const update = useUpdateCommentMutation(questionId);
  const remove = useDeleteCommentMutation(questionId);
  const vote = useVoteCommentMutation(questionId);

  const refetchComments = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS_LIST });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPLIES_LIST });
  };

  const handleError = (error: unknown) => {
    const status = error instanceof ApiError ? error.status : undefined;
    if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
      toast.error(DISCUSSION_COPY.RATE_LIMITED);
      return;
    }
    if (status === HTTP_STATUS.FORBIDDEN) {
      toast.error(DISCUSSION_COPY.ACTION_FORBIDDEN);
      refetchComments();
      return;
    }
    toast.error(getErrorMessage(error));
    if (status === HTTP_STATUS.NOT_FOUND) {
      // Either the comment or the whole question is gone; refetching the question tells which.
      refetchComments();
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.QUESTION_ITEM(user.id, questionId),
        });
      }
    }
  };

  const handleSubmitError = (error: unknown, onLostMentions: (ids: readonly string[]) => void) => {
    const lost = getLostMentionIds(error);
    if (lost.length > 0) onLostMentions(lost);
    else handleError(error);
  };

  return {
    questionId,
    isPosting: create.isPending,
    isEditing: update.isPending,
    isDeleting: remove.isPending,
    post: ({ body, mentionIds, parentId }, { onSuccess, onLostMentions }) =>
      create.mutate(
        { body, mentions: mentionIds, parentId: parentId ?? undefined },
        { onSuccess, onError: (error) => handleSubmitError(error, onLostMentions) },
      ),
    edit: (commentId, { body, mentionIds }, { onSuccess, onLostMentions }) =>
      update.mutate(
        { commentId, payload: { body, mentions: mentionIds } },
        { onSuccess, onError: (error) => handleSubmitError(error, onLostMentions) },
      ),
    remove: ({ id, parentId }, onSuccess) =>
      remove.mutate({ commentId: id, parentId }, { onSuccess, onError: handleError }),
    vote: (commentId, value) => vote.mutate({ commentId, value }, { onError: handleError }),
  };
}
