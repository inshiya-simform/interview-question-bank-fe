import { Button } from '@/components';
import { REVIEW_COPY } from '@/constants';
import { useSubmissionItem } from '../hooks/useSubmissionItem';
import type { MockSubmission } from '../mock/seed';
import { ChangeRequestBanner } from './ChangeRequestBanner';
import { ReviewStatusChip } from './ReviewStatusChip';
import { ReviewTags } from './ReviewTags';

interface SubmissionItemProps {
  submission: MockSubmission;
  onEdit: (id: string) => void;
}

export function SubmissionItem({ submission, onEdit }: SubmissionItemProps) {
  const { submittedOn, isEdit, showsDecision, canEdit } = useSubmissionItem(submission);
  const { id, status, decision, content } = submission;

  return (
    <li className="ritem">
      <div className="ritem__top">
        <h2 className="ritem__text">{content.text}</h2>
        <ReviewStatusChip status={status} isEdit={isEdit} />
      </div>
      <ReviewTags tags={content.tags} />
      {showsDecision && decision && <ChangeRequestBanner status={status} decision={decision} />}
      <div className="ritem__meta">
        <span>{REVIEW_COPY.SUBMITTED_ON(submittedOn)}</span>
        {isEdit && <span>{REVIEW_COPY.LIVE_VERSION_NOTE}</span>}
        {canEdit && (
          <Button
            className="ritem__action"
            variant="secondary"
            aria-label={REVIEW_COPY.EDIT_AND_RESUBMIT_QUESTION(content.text)}
            onClick={() => onEdit(id)}
          >
            {REVIEW_COPY.EDIT_AND_RESUBMIT}
          </Button>
        )}
      </div>
    </li>
  );
}
