import { useId, useState } from 'react';
import { useSession } from '@/features/auth';
import { COMMENT_SORT } from '../constants';
import type { CommentSort, VoteValue } from '../constants';
import type { PostCommentInput } from '../schema';
import { toHandle } from '../utils';
import {
  useCommentsQuery,
  useMentionableUsersQuery,
  usePostCommentMutation,
  useVoteMutation,
} from './useDiscussionData';

export function useDiscussion(questionId: string) {
  const { user } = useSession();
  const titleId = useId();
  const [sort, setSort] = useState<CommentSort>(COMMENT_SORT.TOP);
  const comments = useCommentsQuery(user?.id, questionId, sort);
  const mentionable = useMentionableUsersQuery(user?.id);
  const post = usePostCommentMutation();
  const vote = useVoteMutation();

  const threads = comments.data ?? [];

  const postComment = (input: PostCommentInput, onSuccess: () => void) => {
    if (!user) return;
    const author = { id: user.id, name: user.name, handle: toHandle(user.email), role: user.role };
    post.mutate({ ...input, questionId, author }, { onSuccess });
  };

  return {
    titleId,
    sort,
    setSort,
    threads,
    total: threads.reduce((count, thread) => count + 1 + thread.replies.length, 0),
    users: mentionable.data ?? [],
    isLoading: comments.isPending,
    isError: comments.isError,
    hasData: comments.data !== undefined,
    isPosting: post.isPending,
    refetch: () => void comments.refetch(),
    postComment,
    postTopLevel: (input: Omit<PostCommentInput, 'parentId'>, onSuccess: () => void) =>
      postComment({ ...input, parentId: null }, onSuccess),
    voteOnComment: (commentId: string, value: VoteValue) => {
      if (user) vote.mutate({ commentId, viewerId: user.id, value });
    },
  };
}
