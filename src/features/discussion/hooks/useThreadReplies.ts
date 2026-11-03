import { useState } from 'react';
import type { Thread } from '@/api';
import { useRepliesQuery } from '@/api/hooks';
import { useSession } from '@/features/auth';
import { countRemainingReplies, dedupeById } from '../utils';

// The replies a thread shows: its preview until more are requested, then everything loaded from
// the replies endpoint (which starts at the oldest) followed by any preview-only reply.
export function useThreadReplies(thread: Thread, questionId: string) {
  const { user } = useSession();
  const [isRequested, setIsRequested] = useState(false);
  const query = useRepliesQuery(user?.id, questionId, thread.id, isRequested);

  const loaded = query.data?.pages.flatMap((page) => page.items) ?? [];
  const replies = dedupeById([...loaded, ...thread.replies]);
  return {
    replies,
    remaining: countRemainingReplies({
      replyCount: thread.replyCount,
      shown: replies.length,
      allLoaded: query.data !== undefined && !query.hasNextPage,
      hasNextPage: query.hasNextPage,
    }),
    isLoadingMore: query.isFetching,
    isError: query.isError,
    // The first request starts the query; later ones fetch the next cursor.
    showMore: () => {
      if (isRequested) void query.fetchNextPage();
      else setIsRequested(true);
    },
  };
}
