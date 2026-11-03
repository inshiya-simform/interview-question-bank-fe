// Values are the API's own: they are sent as query params and request bodies.
export const COMMENT_SORT = {
  TOP: 'top',
  NEWEST: 'new',
} as const;

export type CommentSort = (typeof COMMENT_SORT)[keyof typeof COMMENT_SORT];

export const VOTE = {
  UP: 1,
  DOWN: -1,
  NONE: 0,
} as const;

export type VoteValue = (typeof VOTE)[keyof typeof VOTE];

export const COMMENT_PAGE_SIZE = 20;
export const REPLY_PAGE_SIZE = 20;
export const COMMENT_MAX_MENTIONS = 10;
// The counter only appears once the writer is this close to the limit.
export const COMMENT_COUNTER_THRESHOLD = 1800;
export const MENTION_SEARCH_DEBOUNCE_MS = 200;
export const COMMENT_ANCHOR_PREFIX = 'comment-';
