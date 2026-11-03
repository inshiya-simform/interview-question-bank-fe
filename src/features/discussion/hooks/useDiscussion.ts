import { useEffect, useId, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCommentsQuery } from '@/api/hooks';
import { isNotFoundError } from '@/api/errors';
import { QUERY_KEYS } from '@/api/query-keys';
import { COMMENT_SORT } from '@/constants';
import type { CommentSort } from '@/constants';
import { useSession } from '@/features/auth';
import { useCommentActions } from './useCommentActions';
import { useCommentHashScroll } from './useCommentHashScroll';

export function useDiscussion(questionId: string) {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const titleId = useId();
  const [sort, setSort] = useState<CommentSort>(COMMENT_SORT.TOP);
  const comments = useCommentsQuery(user?.id, questionId, sort);
  const actions = useCommentActions(questionId);
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = comments;

  // Offset pages can overlap when a thread arrives between two fetches.
  const threads = [
    ...new Map(
      (comments.data?.pages ?? [])
        .flatMap((page) => page.items)
        .map((thread) => [thread.id, thread]),
    ).values(),
  ];

  // The question page owns the not-found state; refetching the question flips it there.
  const isNotFound = isNotFoundError(comments.error);
  useEffect(() => {
    if (!isNotFound || !user) return;
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUESTION_ITEM(user.id, questionId) });
  }, [isNotFound, user, questionId, queryClient]);

  useCommentHashScroll({
    loadedCount: threads.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: () => void fetchNextPage(),
  });

  return {
    titleId,
    sort,
    setSort,
    actions,
    threads,
    total: comments.data?.pages[0]?.totalComments ?? 0,
    isLoading: comments.isPending,
    isError: comments.isError && !isNotFound,
    hasData: comments.data !== undefined,
    hasNextPage,
    isFetchingNextPage,
    refetch: () => void comments.refetch(),
    loadMore: () => void fetchNextPage(),
  };
}
