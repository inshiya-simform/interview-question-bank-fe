import { useState } from 'react';
import { useSession } from '@/features/auth';
import type { CommentInput, Comment, MentionUser, PostCommentInput, Thread } from '../schema';

export function useCommentThread(
  thread: Thread,
  onPost: (input: PostCommentInput, onSuccess: () => void) => void,
) {
  const { user } = useSession();
  const [replyTarget, setReplyTarget] = useState<MentionUser | null>(null);

  const closeReply = () => setReplyTarget(null);

  return {
    replyTarget,
    // Replying to someone else starts with their mention; replying to yourself needs none.
    replyPrefill: replyTarget && replyTarget.id !== user?.id ? `@${replyTarget.handle} ` : '',
    openReply: (comment: Comment) => setReplyTarget(comment.author),
    closeReply,
    // Replies stay one level deep, so every reply is filed under the thread's root comment.
    submitReply: (input: CommentInput) => onPost({ ...input, parentId: thread.id }, closeReply),
  };
}
