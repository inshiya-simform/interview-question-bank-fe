import { Badge, Icon } from '@/components';
import { DISCUSSION_COPY } from '@/constants';
import type { VoteValue } from '../constants';
import { useCommentItem } from '../hooks/useCommentItem';
import type { Comment } from '../schema';
import { CommentAvatar } from './CommentAvatar';
import { CommentBody } from './CommentBody';
import { VoteControl } from './VoteControl';
import './CommentItem.css';

interface CommentItemProps {
  comment: Comment;
  onReply: (comment: Comment) => void;
  onVote: (commentId: string, value: VoteValue) => void;
}

export function CommentItem({ comment, onReply, onVote }: CommentItemProps) {
  const { isReviewer, createdAgo, parts } = useCommentItem(comment);
  const { author } = comment;

  return (
    <article className="citem">
      <CommentAvatar name={author.name} />
      <div className="citem__main">
        <header className="citem__head">
          <span className="citem__name">{author.name}</span>
          {isReviewer && <Badge variant="success">{DISCUSSION_COPY.REVIEWER}</Badge>}
          <time className="citem__time" dateTime={comment.createdAt}>
            {createdAgo}
          </time>
        </header>
        <CommentBody parts={parts} />
        <div className="citem__actions">
          <VoteControl
            score={comment.score}
            myVote={comment.myVote}
            authorName={author.name}
            onVote={(value) => onVote(comment.id, value)}
          />
          <button
            type="button"
            className="citem__reply"
            aria-label={DISCUSSION_COPY.REPLY_TO(author.name)}
            onClick={() => onReply(comment)}
          >
            <Icon name="reply" size={16} />
            {DISCUSSION_COPY.REPLY}
          </button>
        </div>
      </div>
    </article>
  );
}
