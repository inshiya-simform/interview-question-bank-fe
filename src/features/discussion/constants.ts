import { DISCUSSION_COPY } from '@/constants';

export const COMMENT_SORT = {
  TOP: 'top',
  NEWEST: 'newest',
} as const;

export type CommentSort = (typeof COMMENT_SORT)[keyof typeof COMMENT_SORT];

export const COMMENT_SORT_OPTIONS = [
  { value: COMMENT_SORT.TOP, label: DISCUSSION_COPY.SORT_TOP },
  { value: COMMENT_SORT.NEWEST, label: DISCUSSION_COPY.SORT_NEWEST },
] as const;

export const VOTE = {
  UP: 1,
  DOWN: -1,
  NONE: 0,
} as const;

export type VoteValue = (typeof VOTE)[keyof typeof VOTE];

export const MENTION_SUGGESTION_LIMIT = 5;
