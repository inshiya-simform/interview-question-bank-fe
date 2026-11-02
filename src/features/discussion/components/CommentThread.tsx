import { DISCUSSION_COPY } from '@/constants';
import type { VoteValue } from '../constants';
import { useCommentThread } from '../hooks/useCommentThread';
import type { MentionUser, PostCommentInput, Thread } from '../schema';
import { CommentComposer } from './CommentComposer';
import { CommentItem } from './CommentItem';
import './CommentThread.css';

interface CommentThreadProps {
  thread: Thread;
  users: readonly MentionUser[];
  isPosting: boolean;
  onPost: (input: PostCommentInput, onSuccess: () => void) => void;
  onVote: (commentId: string, value: VoteValue) => void;
}

export function CommentThread({ thread, users, isPosting, onPost, onVote }: CommentThreadProps) {
  const { replyTarget, replyPrefill, openReply, closeReply, submitReply } = useCommentThread(
    thread,
    onPost,
  );

  return (
    <li className="cthread">
      <CommentItem comment={thread} onReply={openReply} onVote={onVote} />
      {thread.replies.length > 0 && (
        <ul className="cthread__replies">
          {thread.replies.map((reply) => (
            <li key={reply.id}>
              <CommentItem comment={reply} onReply={openReply} onVote={onVote} />
            </li>
          ))}
        </ul>
      )}
      {replyTarget && (
        <div className="cthread__composer">
          <CommentComposer
            // Keyed so replying to a different person restarts from their own mention.
            key={replyTarget.id}
            users={users}
            label={DISCUSSION_COPY.REPLY_LABEL(replyTarget.name)}
            placeholder={DISCUSSION_COPY.REPLY_PLACEHOLDER}
            submitLabel={DISCUSSION_COPY.REPLY}
            initialValue={replyPrefill}
            isPending={isPosting}
            autoFocus
            onSubmit={submitReply}
            onCancel={closeReply}
          />
        </div>
      )}
    </li>
  );
}
