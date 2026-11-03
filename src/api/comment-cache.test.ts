import { QueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { VOTE } from '@/constants';
import { appendReply, findCachedComment, patchComment, removeReply } from './comment-cache';
import { QUERY_KEYS } from './query-keys';
import type { CommentListResponse } from './type/comments/comments-list';
import type { ListRepliesResponse } from './type/comments/replies-list';
import type { Comment, Thread } from './type/comments/shared';

const comment = (id: string, overrides: Partial<Comment> = {}): Comment => ({
  id,
  parentId: null,
  body: 'text',
  deleted: false,
  author: { id: 'a', name: 'A' },
  isReviewer: false,
  mentions: [],
  score: 3,
  myVote: VOTE.NONE,
  createdAt: '2026-01-01T00:00:00.000Z',
  editedAt: null,
  canEdit: false,
  canDelete: false,
  canVote: true,
  ...overrides,
});

const thread = (id: string, previews: Comment[], replyCount: number): Thread => ({
  ...comment(id),
  replies: previews,
  replyCount,
  hasMoreReplies: replyCount > previews.length,
});

const LIST_KEY = QUERY_KEYS.COMMENTS('u1', 'q1', 'top');
const REPLIES_KEY = QUERY_KEYS.REPLIES('u1', 'q1', 't1');
const reply = (id: string, score = 1) => comment(id, { parentId: 't1', score });

// Thread t1 has 8 replies; r1..r3 are the preview, r1..r5 were loaded through the replies query.
function seed() {
  const queryClient = new QueryClient();
  const page: CommentListResponse = {
    items: [thread('t1', [reply('r1'), reply('r2'), reply('r3')], 8), thread('t2', [], 0)],
    page: 1,
    limit: 20,
    total: 2,
    totalComments: 10,
  };
  queryClient.setQueryData<InfiniteData<CommentListResponse>>(LIST_KEY, {
    pages: [page],
    pageParams: [1],
  });
  const loaded: ListRepliesResponse = {
    items: ['r1', 'r2', 'r3', 'r4', 'r5'].map((id) => reply(id)),
    nextCursor: 'c1',
  };
  queryClient.setQueryData<InfiniteData<ListRepliesResponse>>(REPLIES_KEY, {
    pages: [loaded],
    pageParams: [undefined],
  });
  return queryClient;
}

const listItems = (queryClient: QueryClient) =>
  queryClient.getQueryData<InfiniteData<CommentListResponse>>(LIST_KEY)?.pages[0];
const loadedReplies = (queryClient: QueryClient) =>
  queryClient.getQueryData<InfiniteData<ListRepliesResponse>>(REPLIES_KEY)?.pages[0]?.items ?? [];

describe('findCachedComment', () => {
  it('finds a thread, a preview reply and a reply only the replies query has', () => {
    const queryClient = seed();
    expect(findCachedComment(queryClient, 't2')?.id).toBe('t2');
    expect(findCachedComment(queryClient, 'r2')?.id).toBe('r2');
    expect(findCachedComment(queryClient, 'r5')?.id).toBe('r5');
    expect(findCachedComment(queryClient, 'missing')).toBeUndefined();
  });
});

describe('patchComment', () => {
  it('updates a reply in both the list preview and the replies query', () => {
    const queryClient = seed();
    patchComment(queryClient, 'r2', { score: 9, myVote: VOTE.UP });
    const preview = listItems(queryClient)?.items[0]?.replies;
    expect(preview?.[1]).toMatchObject({ score: 9, myVote: VOTE.UP });
    expect(loadedReplies(queryClient)[1]).toMatchObject({ score: 9, myVote: VOTE.UP });
    expect(preview?.[0]).toMatchObject({ score: 1 });
  });

  it('updates a reply that is only in the replies query, and a thread', () => {
    const queryClient = seed();
    patchComment(queryClient, 'r5', { score: 7 });
    patchComment(queryClient, 't2', { body: 'edited' });
    expect(loadedReplies(queryClient)[4]).toMatchObject({ score: 7 });
    expect(listItems(queryClient)?.items[1]).toMatchObject({ body: 'edited', replyCount: 0 });
  });

  it('never reorders or drops thread fields', () => {
    const queryClient = seed();
    patchComment(queryClient, 't1', { score: 10 });
    const items = listItems(queryClient)?.items;
    expect(items?.map((item) => item.id)).toEqual(['t1', 't2']);
    expect(items?.[0]).toMatchObject({ score: 10, replyCount: 8, hasMoreReplies: true });
  });
});

describe('appendReply', () => {
  it('adds the reply after the preview and counts it', () => {
    const queryClient = seed();
    appendReply(queryClient, reply('new'));
    const page = listItems(queryClient);
    expect(page?.items[0]?.replies.map((item) => item.id)).toEqual(['r1', 'r2', 'r3', 'new']);
    expect(page?.items[0]).toMatchObject({ replyCount: 9, hasMoreReplies: true });
    expect(page?.totalComments).toBe(11);
  });

  it('ignores a reply that is already there, and top-level comments', () => {
    const queryClient = seed();
    appendReply(queryClient, reply('r1'));
    appendReply(queryClient, comment('top'));
    expect(listItems(queryClient)?.items[0]).toMatchObject({ replyCount: 8 });
    expect(listItems(queryClient)?.totalComments).toBe(10);
  });
});

describe('removeReply', () => {
  it('removes the reply from the preview and the replies query and counts it', () => {
    const queryClient = seed();
    removeReply(queryClient, { id: 'r2', parentId: 't1' });
    const page = listItems(queryClient);
    expect(page?.items[0]?.replies.map((item) => item.id)).toEqual(['r1', 'r3']);
    expect(page?.items[0]).toMatchObject({ replyCount: 7, hasMoreReplies: true });
    expect(page?.totalComments).toBe(9);
    expect(loadedReplies(queryClient).map((item) => item.id)).toEqual(['r1', 'r3', 'r4', 'r5']);
  });

  it('does nothing for a top-level comment', () => {
    const queryClient = seed();
    removeReply(queryClient, { id: 't2', parentId: null });
    expect(listItems(queryClient)?.totalComments).toBe(10);
  });
});
