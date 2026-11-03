import type { QueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { QUERY_KEYS } from './query-keys';
import { commentListResponseSchema } from './type/comments/comments-list';
import type { CommentListResponse } from './type/comments/comments-list';
import { listRepliesResponseSchema } from './type/comments/replies-list';
import type { ListRepliesResponse } from './type/comments/replies-list';
import type { Comment, Thread } from './type/comments/shared';

// Pure cache transforms for comments. A comment can be cached twice: in a thread list (as the
// thread itself or in its preview replies) and in that thread's "more replies" query. Every
// update goes through `mapCaches` so both stay in step.
const infiniteListSchema = z.object({
  pages: z.array(commentListResponseSchema),
  pageParams: z.array(z.unknown()),
});
const infiniteRepliesSchema = z.object({
  pages: z.array(listRepliesResponseSchema),
  pageParams: z.array(z.unknown()),
});

type RepliesMapper = (page: ListRepliesResponse) => ListRepliesResponse;

function mapListCaches(
  queryClient: QueryClient,
  mapPage: (page: CommentListResponse) => CommentListResponse,
) {
  queryClient.setQueriesData({ queryKey: QUERY_KEYS.COMMENTS_LIST }, (old: unknown) => {
    const cached = infiniteListSchema.safeParse(old);
    return cached.success ? { ...cached.data, pages: cached.data.pages.map(mapPage) } : old;
  });
}

// A replies query's key is ['comment-replies', userId, questionId, threadId]; the page data does
// not name its thread, so `threadId` narrows through the key.
function mapReplyCaches(queryClient: QueryClient, mapPage: RepliesMapper, threadId?: string) {
  for (const [key] of queryClient.getQueriesData({ queryKey: QUERY_KEYS.REPLIES_LIST })) {
    if (threadId !== undefined && key[3] !== threadId) continue;
    queryClient.setQueryData(key, (old: unknown) => {
      const cached = infiniteRepliesSchema.safeParse(old);
      return cached.success ? { ...cached.data, pages: cached.data.pages.map(mapPage) } : old;
    });
  }
}

const withReplies = (thread: Thread, replies: Comment[]): Thread => ({
  ...thread,
  replies,
  hasMoreReplies: thread.replyCount > replies.length,
});

// Applies `patch` to the comment with `id` wherever it is cached: as a thread, as a preview
// reply, or in a thread's replies query.
export function patchComment(queryClient: QueryClient, id: string, patch: Partial<Comment>) {
  const apply = (comment: Comment): Comment =>
    comment.id === id ? { ...comment, ...patch } : comment;
  mapListCaches(queryClient, (page) => ({
    ...page,
    items: page.items.map((thread) => ({
      ...thread,
      ...(thread.id === id ? patch : {}),
      replies: thread.replies.map(apply),
    })),
  }));
  mapReplyCaches(queryClient, (page) => ({ ...page, items: page.items.map(apply) }));
}

export function findCachedComment(queryClient: QueryClient, id: string): Comment | undefined {
  const lists = queryClient.getQueriesData({ queryKey: QUERY_KEYS.COMMENTS_LIST });
  for (const [, old] of lists) {
    const cached = infiniteListSchema.safeParse(old);
    if (!cached.success) continue;
    for (const thread of cached.data.pages.flatMap((page) => page.items)) {
      const found = [thread, ...thread.replies].find((comment) => comment.id === id);
      if (found) return found;
    }
  }
  const replyLists = queryClient.getQueriesData({ queryKey: QUERY_KEYS.REPLIES_LIST });
  for (const [, old] of replyLists) {
    const cached = infiniteRepliesSchema.safeParse(old);
    const found = cached.success
      ? cached.data.pages.flatMap((page) => page.items).find((comment) => comment.id === id)
      : undefined;
    if (found) return found;
  }
  return undefined;
}

// A new reply goes at the end of what the thread shows, even when older replies are not loaded
// yet; the replies query dedupes it by id if it later returns it too.
export function appendReply(queryClient: QueryClient, reply: Comment) {
  if (reply.parentId === null) return;
  const rootId = reply.parentId;
  mapListCaches(queryClient, (page) => {
    const root = page.items.find((thread) => thread.id === rootId);
    // Already shown (e.g. a repeat of the same response): nothing to add or count.
    if (!root || root.replies.some((existing) => existing.id === reply.id)) return page;
    return {
      ...page,
      totalComments: page.totalComments + 1,
      items: page.items.map((thread) =>
        thread.id === rootId
          ? withReplies({ ...thread, replyCount: thread.replyCount + 1 }, [
              ...thread.replies,
              reply,
            ])
          : thread,
      ),
    };
  });
}

export function removeReply(queryClient: QueryClient, reply: Pick<Comment, 'id' | 'parentId'>) {
  if (reply.parentId === null) return;
  const rootId = reply.parentId;
  mapListCaches(queryClient, (page) => {
    const hasRoot = page.items.some((thread) => thread.id === rootId);
    return {
      ...page,
      totalComments: hasRoot ? Math.max(page.totalComments - 1, 0) : page.totalComments,
      items: page.items.map((thread) =>
        thread.id === rootId
          ? withReplies(
              { ...thread, replyCount: Math.max(thread.replyCount - 1, 0) },
              thread.replies.filter((existing) => existing.id !== reply.id),
            )
          : thread,
      ),
    };
  });
  mapReplyCaches(
    queryClient,
    (page) => ({ ...page, items: page.items.filter((existing) => existing.id !== reply.id) }),
    rootId,
  );
}
