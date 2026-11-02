import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/api/query-keys';
import type { CommentSort } from '../constants';
import {
  getComments,
  getMentionableUsers,
  postComment,
  voteOnComment,
} from '../mock/discussionMock';

// Wraps the mock service the way api/hooks will wrap the real one; move this file there (and the
// mock out) when the discussion endpoints exist.
export function useCommentsQuery(
  userId: string | undefined,
  questionId: string,
  sort: CommentSort,
) {
  return useQuery({
    queryKey: QUERY_KEYS.COMMENTS(userId ?? '', questionId, sort),
    queryFn: () => getComments(questionId, sort, userId ?? ''),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
}

export function useMentionableUsersQuery(userId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.MENTIONABLE_USERS(userId ?? ''),
    queryFn: () => getMentionableUsers(userId ?? ''),
    enabled: Boolean(userId),
  });
}

export function usePostCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS_LIST }),
  });
}

export function useVoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: voteOnComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS_LIST }),
  });
}
