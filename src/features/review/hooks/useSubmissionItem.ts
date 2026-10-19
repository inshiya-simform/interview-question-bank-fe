import { REVIEW_KIND, REVIEW_STATUS } from '@/constants';
import type { MockSubmission } from '../mock/seed';
import { formatDate } from '@/utils/date';

export function useSubmissionItem(submission: MockSubmission) {
  const { status, kind, decision, submittedAt } = submission;
  return {
    submittedOn: formatDate(submittedAt),
    isEdit: kind === REVIEW_KIND.EDIT,
    showsDecision:
      Boolean(decision) &&
      (status === REVIEW_STATUS.CHANGES_REQUESTED || status === REVIEW_STATUS.REJECTED),
    // A rejected submission is final; everything else can be edited and resubmitted.
    canEdit: status !== REVIEW_STATUS.REJECTED,
  };
}
