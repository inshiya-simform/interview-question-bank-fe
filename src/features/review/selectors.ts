import type { ReviewContent, ReviewDecision, ReviewedQuestion } from '@/api';
import { ALL_STATUSES, QUEUE_TABS, REVIEW_STATUS } from '@/constants';
import type { ReviewStatus, StatusTab } from '@/constants';

// "All" covers the statuses the API lists by default, so it matches the list it filters.
export function countsFromApi(
  counts: Partial<Record<ReviewStatus, number>>,
): Record<StatusTab, number> {
  const get = (status: ReviewStatus) => counts[status] ?? 0;
  return {
    [ALL_STATUSES]: QUEUE_TABS.reduce((sum, tab) => (tab ? sum + get(tab) : sum), 0),
    [REVIEW_STATUS.PENDING_REVIEW]: get(REVIEW_STATUS.PENDING_REVIEW),
    [REVIEW_STATUS.CHANGES_REQUESTED]: get(REVIEW_STATUS.CHANGES_REQUESTED),
    [REVIEW_STATUS.APPROVED]: get(REVIEW_STATUS.APPROVED),
    [REVIEW_STATUS.REJECTED]: get(REVIEW_STATUS.REJECTED),
  };
}

// An edit of a live question: the question itself is the live version, the draft is the edit.
export const isEditSubmission = (question: ReviewedQuestion): boolean =>
  question.isLive && Boolean(question.draft);

export const toLiveContent = ({
  text,
  answerNotes,
  client,
  tags,
}: ReviewedQuestion): ReviewContent => ({
  text,
  answerNotes,
  client,
  tags,
});

// What awaits review: the pending edit when there is one, otherwise the question as stored.
export const toSubmittedContent = (question: ReviewedQuestion): ReviewContent =>
  question.draft ?? toLiveContent(question);

export function toDecision(question: ReviewedQuestion): ReviewDecision | null {
  const { reviewedBy, reviewedAt, reviewNote } = question;
  return reviewedBy && reviewedAt
    ? { note: reviewNote, decidedBy: reviewedBy, decidedAt: reviewedAt }
    : null;
}

export const submittedAtOf = (question: ReviewedQuestion): string =>
  question.submittedAt ?? question.createdAt;
