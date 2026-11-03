import { useState } from 'react';
import type { Comment, Thread } from '@/api';
import { useSession } from '@/features/auth';
import type { CommentActions, CommentInput, SubmitCallbacks } from '../schema';
import { useThreadReplies } from './useThreadReplies';

export function useCommentThread(thread: Thread, actions: CommentActions) {
  const { user } = useSession();
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const replies = useThreadReplies(thread, actions.questionId);

  const closeReply = () => setReplyTo(null);
  // Replying to someone else starts with their mention; replying to yourself needs none.
  const target = replyTo && replyTo.author.id !== user?.id ? replyTo.author : null;

  return {
    ...replies,
    replyTo,
    replyPrefill: target ? `@${target.name} ` : '',
    replyMentions: target ? [target] : [],
    openReply: setReplyTo,
    closeReply,
    // The clicked comment is the parent: the API files replies-to-replies under the root itself.
    submitReply: (input: CommentInput, callbacks: SubmitCallbacks) => {
      if (!replyTo) return;
      actions.post(
        { ...input, parentId: replyTo.id },
        {
          ...callbacks,
          onSuccess: () => {
            callbacks.onSuccess();
            closeReply();
          },
        },
      );
    },
  };
}
