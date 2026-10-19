import type { ReviewedQuestion } from '@/api';
import { REVIEW_STATUS } from '@/constants';
import { formatDate } from '@/utils/date';
import { isEditSubmission, submittedAtOf, toDecision, toSubmittedContent } from '../selectors';

export function useSubmissionItem(submission: ReviewedQuestion) {
  const { status } = submission;
  const decision = toDecision(submission);
  return {
    content: toSubmittedContent(submission),
    decision,
    submittedOn: formatDate(submittedAtOf(submission)),
    isEdit: isEditSubmission(submission),
    showsDecision:
      Boolean(decision) &&
      (status === REVIEW_STATUS.CHANGES_REQUESTED || status === REVIEW_STATUS.REJECTED),
    // A rejected submission is final; everything else can be edited and resubmitted.
    canEdit: status !== REVIEW_STATUS.REJECTED,
  };
}
