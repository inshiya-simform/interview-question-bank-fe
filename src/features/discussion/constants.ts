import { COMMENT_SORT, DISCUSSION_COPY } from '@/constants';

export const COMMENT_SORT_OPTIONS = [
  { value: COMMENT_SORT.TOP, label: DISCUSSION_COPY.SORT_TOP },
  { value: COMMENT_SORT.NEWEST, label: DISCUSSION_COPY.SORT_NEWEST },
] as const;
