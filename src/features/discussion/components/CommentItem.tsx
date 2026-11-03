import type { Comment } from '@/api';
import { Badge, Icon } from '@/components';
import { DISCUSSION_COPY, commentAnchorId } from '@/constants';
import { useCommentItem } from '../hooks/useCommentItem';
import type { CommentActions } from '../schema';
import { CommentAvatar } from './CommentAvatar';
import { CommentBody } from './CommentBody';
import { CommentComposer } from './CommentComposer';
import { DeleteCommentModal } from './DeleteCommentModal';
import { VoteControl } from './VoteControl';
import './CommentItem.css';

interface CommentItemProps {
  comment: Comment;
  actions: CommentActions;
  onReply: (comment: Comment) => void;
}

export function CommentItem({ comment, actions, onReply }: CommentItemProps) {
  const item = useCommentItem(comment, actions);
  const { author } = comment;

  // Kept in place so its replies stay readable; there is nothing left to act on.
  if (item.isDeleted) {
    return (
      <article id={commentAnchorId(comment.id)} tabIndex={-1} className="citem">
        <p className="citem__deleted">{DISCUSSION_COPY.DELETED}</p>
      </article>
    );
  }

  return (
    <article id={commentAnchorId(comment.id)} tabIndex={-1} className="citem">
      <CommentAvatar name={author.name} />
      <div className="citem__main">
        <header className="citem__head">
          <span className="citem__name">{author.name}</span>
          {comment.isReviewer && <Badge variant="success">{DISCUSSION_COPY.REVIEWER}</Badge>}
          <time className="citem__time" dateTime={comment.createdAt}>
            {item.createdAgo}
          </time>
          {item.isEdited && <span className="citem__time">{DISCUSSION_COPY.EDITED}</span>}
        </header>
        {item.isEditing ? (
          <CommentComposer
            questionId={actions.questionId}
            label={DISCUSSION_COPY.EDIT_LABEL}
            placeholder={DISCUSSION_COPY.EDIT_PLACEHOLDER}
            submitLabel={DISCUSSION_COPY.SAVE}
            initialValue={comment.body ?? ''}
            initialMentions={comment.mentions}
            original={item.original}
            isPending={actions.isEditing}
            autoFocus
            onSubmit={item.submitEdit}
            onCancel={item.stopEdit}
          />
        ) : (
          <>
            <CommentBody parts={item.parts} />
            <div className="citem__actions">
              <VoteControl
                score={comment.score}
                myVote={comment.myVote}
                canVote={comment.canVote}
                authorName={author.name}
                onVote={(value) => actions.vote(comment.id, value)}
              />
              <button
                type="button"
                className="citem__action"
                aria-label={DISCUSSION_COPY.REPLY_TO(author.name)}
                onClick={() => onReply(comment)}
              >
                <Icon name="reply" size={16} />
                {DISCUSSION_COPY.REPLY}
              </button>
              {comment.canEdit && (
                <button
                  type="button"
                  className="citem__action"
                  aria-label={DISCUSSION_COPY.EDIT_TO(author.name)}
                  onClick={item.startEdit}
                >
                  <Icon name="edit" size={16} />
                  {DISCUSSION_COPY.EDIT}
                </button>
              )}
              {comment.canDelete && (
                <button
                  type="button"
                  className="citem__action"
                  aria-label={DISCUSSION_COPY.DELETE_TO(author.name)}
                  onClick={item.openDelete}
                >
                  <Icon name="trash" size={16} />
                  {DISCUSSION_COPY.DELETE}
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <DeleteCommentModal
        isOpen={item.isDeleteOpen}
        isPending={actions.isDeleting}
        onClose={item.closeDelete}
        onConfirm={item.confirmDelete}
      />
    </article>
  );
}
