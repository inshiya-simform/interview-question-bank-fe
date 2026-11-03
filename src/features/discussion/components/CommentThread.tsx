import type { Thread } from '@/api';
import { DISCUSSION_COPY } from '@/constants';
import { useCommentThread } from '../hooks/useCommentThread';
import type { CommentActions } from '../schema';
import { CommentComposer } from './CommentComposer';
import { CommentItem } from './CommentItem';
import { MoreReplies } from './MoreReplies';
import './CommentThread.css';

interface CommentThreadProps {
  thread: Thread;
  actions: CommentActions;
}

export function CommentThread({ thread, actions }: CommentThreadProps) {
  const {
    replies,
    remaining,
    isLoadingMore,
    isError,
    showMore,
    replyTo,
    replyPrefill,
    replyMentions,
    openReply,
    closeReply,
    submitReply,
  } = useCommentThread(thread, actions);

  return (
    <li className="cthread">
      <CommentItem comment={thread} actions={actions} onReply={openReply} />
      {replies.length > 0 && (
        <ul className="cthread__replies">
          {replies.map((reply) => (
            <li key={reply.id}>
              <CommentItem comment={reply} actions={actions} onReply={openReply} />
            </li>
          ))}
        </ul>
      )}
      {remaining > 0 && (
        <MoreReplies
          remaining={remaining}
          authorName={thread.author.name}
          isLoading={isLoadingMore}
          isError={isError}
          onClick={showMore}
        />
      )}
      {replyTo && (
        <div className="cthread__composer">
          <CommentComposer
            // Keyed so replying to a different comment restarts from its author's mention.
            key={replyTo.id}
            questionId={actions.questionId}
            label={DISCUSSION_COPY.REPLY_LABEL(replyTo.author.name)}
            placeholder={DISCUSSION_COPY.REPLY_PLACEHOLDER}
            submitLabel={DISCUSSION_COPY.REPLY}
            initialValue={replyPrefill}
            initialMentions={replyMentions}
            isPending={actions.isPosting}
            autoFocus
            onSubmit={submitReply}
            onCancel={closeReply}
          />
        </div>
      )}
    </li>
  );
}
