import { Button } from '@/components';
import { REVIEW_COPY, REVIEW_KIND, REVIEW_STATUS } from '@/constants';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/cn';
import type { MockSubmission } from '../mock/seed';
import { ReviewStatusChip } from './ReviewStatusChip';
import { ReviewTags } from './ReviewTags';

interface ReviewQueueRowProps {
  submission: MockSubmission;
  onReview: (id: string) => void;
}

export function ReviewQueueRow({ submission, onReview }: ReviewQueueRowProps) {
  const { id, kind, status, submitter, submittedAt, content } = submission;
  const isEdit = kind === REVIEW_KIND.EDIT;

  return (
    <li className="ritem">
      <div className="ritem__top">
        <span className={cn('ritem__kind', !isEdit && 'ritem__kind--new')}>
          {isEdit ? REVIEW_COPY.KIND_EDIT : REVIEW_COPY.KIND_NEW}
        </span>
        <h2 className="ritem__text">{content.text}</h2>
        <ReviewStatusChip status={status} />
      </div>
      <ReviewTags tags={content.tags} />
      <div className="ritem__meta">
        <span>{REVIEW_COPY.BY_SUBMITTER(submitter.name)}</span>
        <span>{REVIEW_COPY.SUBMITTED_ON(formatDate(submittedAt))}</span>
        <Button
          className="ritem__action"
          variant={status === REVIEW_STATUS.PENDING_REVIEW ? 'primary' : 'secondary'}
          aria-label={REVIEW_COPY.REVIEW_QUESTION(content.text)}
          onClick={() => onReview(id)}
        >
          {REVIEW_COPY.REVIEW}
        </Button>
      </div>
    </li>
  );
}
