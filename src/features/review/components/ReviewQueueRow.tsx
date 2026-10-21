import { Button } from '@/components';
import type { ReviewedQuestion, ReviewPerson } from '@/api';
import { REVIEW_COPY, REVIEW_STATUS } from '@/constants';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/cn';
import { isEditSubmission, submittedAtOf, toSubmittedContent } from '../selectors';
import { ReviewStatusChip } from './ReviewStatusChip';
import { ReviewTags } from './ReviewTags';

interface ReviewQueueRowProps {
  submission: ReviewedQuestion;
  onReview: (submission: ReviewedQuestion) => void;
  // Another reviewer currently holds this question.
  lockOwner?: ReviewPerson;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function ReviewQueueRow({
  submission,
  onReview,
  lockOwner,
  isSelected,
  onToggle,
}: ReviewQueueRowProps) {
  const { id, status, author } = submission;
  const content = toSubmittedContent(submission);
  const isEdit = isEditSubmission(submission);

  return (
    <li className={cn('ritem', isSelected && 'ritem--selected')}>
      <div className="ritem__top">
        {status === REVIEW_STATUS.PENDING_REVIEW && (
          <input
            type="checkbox"
            className="rcheck"
            checked={isSelected}
            disabled={Boolean(lockOwner)}
            title={lockOwner ? REVIEW_COPY.BULK_SELECT_LOCKED(lockOwner.name) : undefined}
            aria-label={REVIEW_COPY.BULK_SELECT_ROW(content.text)}
            onChange={() => onToggle(id)}
          />
        )}
        <span className={cn('ritem__kind', !isEdit && 'ritem__kind--new')}>
          {isEdit ? REVIEW_COPY.KIND_EDIT : REVIEW_COPY.KIND_NEW}
        </span>
        <h2 className="ritem__text">{content.text}</h2>
        <ReviewStatusChip status={status} />
        {lockOwner && (
          <span className="ritem__lock">
            <span aria-hidden="true">🔒 </span>
            {REVIEW_COPY.BEING_REVIEWED_BY(lockOwner.name)}
          </span>
        )}
      </div>
      <ReviewTags tags={content.tags} />
      <div className="ritem__meta">
        <span>{REVIEW_COPY.BY_SUBMITTER(author.name)}</span>
        <span>{REVIEW_COPY.SUBMITTED_ON(formatDate(submittedAtOf(submission)))}</span>
        <Button
          className="ritem__action"
          variant={status === REVIEW_STATUS.PENDING_REVIEW ? 'primary' : 'secondary'}
          aria-label={REVIEW_COPY.REVIEW_QUESTION(content.text)}
          onClick={() => onReview(submission)}
        >
          {REVIEW_COPY.REVIEW}
        </Button>
      </div>
    </li>
  );
}
