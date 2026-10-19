import { REVIEW_HISTORY_EVENT, REVIEW_STATUS } from '@/constants';
import type { ReviewContent } from '@/api';
import { MOCK_ME, MOCK_REVIEWER, SEED_SUBMISSIONS } from './seed';
import type { MockSubmission } from './seed';

// MOCK STORE: an in-memory stand-in for the review API. Replace the hooks that read it
// (features/review/hooks) with real query hooks once the endpoints are available.
let submissions: readonly MockSubmission[] = SEED_SUBMISSIONS;
const listeners = new Set<() => void>();
let nextHistoryId = 1;

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getSnapshot = () => submissions;

function update(id: string, change: (item: MockSubmission, at: string) => MockSubmission) {
  const at = new Date().toISOString();
  submissions = submissions.map((item) => (item.id === id ? change(item, at) : item));
  listeners.forEach((listener) => listener());
}

const withEntry = (
  item: MockSubmission,
  event: (typeof REVIEW_HISTORY_EVENT)[keyof typeof REVIEW_HISTORY_EVENT],
  actor: MockSubmission['submitter'],
  at: string,
  note?: string,
) => [{ id: `mock-h-${nextHistoryId++}`, event, actor, at, note }, ...item.history];

export function approveSubmission(id: string) {
  update(id, (item, at) => ({
    ...item,
    status: REVIEW_STATUS.APPROVED,
    live: item.content,
    decision: null,
    history: withEntry(item, REVIEW_HISTORY_EVENT.APPROVED, MOCK_REVIEWER, at),
  }));
}

export function requestSubmissionChanges(id: string, note: string) {
  update(id, (item, at) => ({
    ...item,
    status: REVIEW_STATUS.CHANGES_REQUESTED,
    decision: { note, decidedBy: MOCK_REVIEWER, decidedAt: at },
    history: withEntry(item, REVIEW_HISTORY_EVENT.CHANGES_REQUESTED, MOCK_REVIEWER, at, note),
  }));
}

export function rejectSubmission(id: string, reason: string) {
  update(id, (item, at) => ({
    ...item,
    status: REVIEW_STATUS.REJECTED,
    decision: { note: reason || null, decidedBy: MOCK_REVIEWER, decidedAt: at },
    history: withEntry(item, REVIEW_HISTORY_EVENT.REJECTED, MOCK_REVIEWER, at, reason || undefined),
  }));
}

// Saving an edit puts the submission back in the queue.
export function resubmitSubmission(
  id: string,
  content: Pick<ReviewContent, 'text' | 'answerNotes'>,
) {
  update(id, (item, at) => ({
    ...item,
    status: REVIEW_STATUS.PENDING_REVIEW,
    submittedAt: at,
    decision: null,
    content: { ...item.content, ...content },
    history: withEntry(item, REVIEW_HISTORY_EVENT.EDITED, MOCK_ME, at),
  }));
}
