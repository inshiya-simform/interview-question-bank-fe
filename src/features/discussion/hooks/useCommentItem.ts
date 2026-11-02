import { ROLES } from '@/constants';
import { formatRelativeTime } from '@/utils/relativeTime';
import type { Comment } from '../schema';
import { splitMentions } from '../utils';

export function useCommentItem(comment: Comment) {
  return {
    isReviewer: comment.author.role === ROLES.REVIEWER,
    createdAgo: formatRelativeTime(comment.createdAt),
    parts: splitMentions(comment.body, comment.mentions),
  };
}
