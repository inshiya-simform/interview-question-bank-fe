import type { HistoryEntry, ReviewPerson, Submission } from '@/api';
import { REVIEW_HISTORY_EVENT, REVIEW_KIND, REVIEW_STATUS } from '@/constants';

// MOCK DATA: stands in for the review API until real endpoints exist.
export type MockSubmission = Submission & { isMine: boolean };

export const MOCK_REVIEWER: ReviewPerson = { id: 'mock-reviewer', name: 'Priya N.' };
export const MOCK_ME: ReviewPerson = { id: 'mock-me', name: 'You' };
const JORDAN: ReviewPerson = { id: 'mock-jordan', name: 'Jordan K.' };
const SAM: ReviewPerson = { id: 'mock-sam', name: 'Sam R.' };

const entry = (
  id: string,
  event: HistoryEntry['event'],
  actor: ReviewPerson,
  at: string,
  note?: string,
): HistoryEntry => ({ id, event, actor, at, note });

export const SEED_SUBMISSIONS: MockSubmission[] = [
  {
    id: 'mock-1',
    isMine: true,
    kind: REVIEW_KIND.NEW,
    status: REVIEW_STATUS.PENDING_REVIEW,
    submitter: MOCK_ME,
    submittedAt: '2026-10-18T09:30:00Z',
    content: {
      text: 'What is event loop starvation?',
      answerNotes:
        'A long synchronous task blocks timers and I/O callbacks. Look for mention of chunking work or worker threads.',
      tags: { technology: ['Node.js'], seniority: ['Mid'] },
    },
    history: [entry('h1', REVIEW_HISTORY_EVENT.SUBMITTED, MOCK_ME, '2026-10-18T09:30:00Z')],
  },
  {
    id: 'mock-2',
    isMine: true,
    kind: REVIEW_KIND.EDIT,
    status: REVIEW_STATUS.PENDING_REVIEW,
    submitter: MOCK_ME,
    submittedAt: '2026-10-17T11:02:00Z',
    content: {
      text: 'How does Postgres MVCC avoid read locks?',
      answerNotes:
        'Readers see a consistent snapshot; writers create new row versions and old ones are vacuumed later.',
      tags: { technology: ['PostgreSQL'] },
    },
    live: {
      text: 'How does Postgres MVCC avoid read locks?',
      answerNotes:
        'Readers see a snapshot taken at statement start; writers create new row versions.',
      tags: { technology: ['PostgreSQL'] },
    },
    history: [
      entry('h2', REVIEW_HISTORY_EVENT.EDITED, MOCK_ME, '2026-10-17T11:02:00Z'),
      entry('h3', REVIEW_HISTORY_EVENT.APPROVED, MOCK_REVIEWER, '2026-10-03T09:40:00Z'),
      entry('h4', REVIEW_HISTORY_EVENT.SUBMITTED, MOCK_ME, '2026-10-02T17:15:00Z'),
    ],
  },
  {
    id: 'mock-3',
    isMine: true,
    kind: REVIEW_KIND.NEW,
    status: REVIEW_STATUS.CHANGES_REQUESTED,
    submitter: MOCK_ME,
    submittedAt: '2026-10-13T10:00:00Z',
    content: {
      text: 'Describe a time you handled conflict in a team.',
      answerNotes: 'Look for ownership and a concrete outcome.',
      tags: { 'question-type': ['Behavioural'] },
    },
    decision: {
      note: 'Make it a behavioural prompt with a follow-up. "Describe a time" is too open for a screening round.',
      decidedBy: MOCK_REVIEWER,
      decidedAt: '2026-10-14T16:20:00Z',
    },
    history: [
      entry(
        'h5',
        REVIEW_HISTORY_EVENT.CHANGES_REQUESTED,
        MOCK_REVIEWER,
        '2026-10-14T16:20:00Z',
        'Make it a behavioural prompt with a follow-up. "Describe a time" is too open for a screening round.',
      ),
      entry('h6', REVIEW_HISTORY_EVENT.SUBMITTED, MOCK_ME, '2026-10-13T10:00:00Z'),
    ],
  },
  {
    id: 'mock-4',
    isMine: true,
    kind: REVIEW_KIND.NEW,
    status: REVIEW_STATUS.REJECTED,
    submitter: MOCK_ME,
    submittedAt: '2026-10-11T08:00:00Z',
    content: {
      text: 'Name every HTTP status code.',
      answerNotes: 'Recall of the full list.',
      tags: { technology: ['HTTP'] },
    },
    decision: {
      note: 'Not a useful screening question: rote recall with no signal.',
      decidedBy: MOCK_REVIEWER,
      decidedAt: '2026-10-12T10:05:00Z',
    },
    history: [
      entry(
        'h7',
        REVIEW_HISTORY_EVENT.REJECTED,
        MOCK_REVIEWER,
        '2026-10-12T10:05:00Z',
        'Not a useful screening question: rote recall with no signal.',
      ),
      entry('h8', REVIEW_HISTORY_EVENT.SUBMITTED, MOCK_ME, '2026-10-11T08:00:00Z'),
    ],
  },
  {
    id: 'mock-5',
    isMine: true,
    kind: REVIEW_KIND.NEW,
    status: REVIEW_STATUS.REJECTED,
    submitter: MOCK_ME,
    submittedAt: '2026-10-09T08:00:00Z',
    content: {
      text: 'What is your favourite programming language?',
      answerNotes: 'Opinion question.',
      tags: { 'question-type': ['Warm-up'] },
    },
    decision: { decidedBy: MOCK_REVIEWER, decidedAt: '2026-10-10T09:00:00Z' },
    history: [
      entry('h9', REVIEW_HISTORY_EVENT.REJECTED, MOCK_REVIEWER, '2026-10-10T09:00:00Z'),
      entry('h10', REVIEW_HISTORY_EVENT.SUBMITTED, MOCK_ME, '2026-10-09T08:00:00Z'),
    ],
  },
  {
    id: 'mock-6',
    isMine: false,
    kind: REVIEW_KIND.NEW,
    status: REVIEW_STATUS.PENDING_REVIEW,
    submitter: JORDAN,
    submittedAt: '2026-10-16T14:10:00Z',
    content: {
      text: 'When would you choose a message queue over a direct API call?',
      answerNotes: 'Decoupling, retries, back-pressure, eventual consistency trade-offs.',
      tags: { technology: ['Architecture'], seniority: ['Senior'] },
    },
    history: [entry('h11', REVIEW_HISTORY_EVENT.SUBMITTED, JORDAN, '2026-10-16T14:10:00Z')],
  },
  {
    id: 'mock-7',
    isMine: false,
    kind: REVIEW_KIND.EDIT,
    status: REVIEW_STATUS.PENDING_REVIEW,
    submitter: SAM,
    submittedAt: '2026-10-15T13:45:00Z',
    content: {
      text: 'Explain the difference between useMemo and useCallback, and when neither is needed.',
      answerNotes:
        'Memoised value vs memoised function reference. Neither helps if the child is not memoised.',
      tags: { technology: ['React'] },
    },
    live: {
      text: 'Explain the difference between useMemo and useCallback.',
      answerNotes: 'Memoised value vs memoised function reference.',
      tags: { technology: ['React'] },
    },
    history: [
      entry('h12', REVIEW_HISTORY_EVENT.EDITED, SAM, '2026-10-15T13:45:00Z'),
      entry('h13', REVIEW_HISTORY_EVENT.APPROVED, MOCK_REVIEWER, '2026-09-28T10:00:00Z'),
      entry('h14', REVIEW_HISTORY_EVENT.SUBMITTED, SAM, '2026-09-27T15:00:00Z'),
    ],
  },
  {
    id: 'mock-8',
    isMine: false,
    kind: REVIEW_KIND.NEW,
    status: REVIEW_STATUS.PENDING_REVIEW,
    submitter: JORDAN,
    submittedAt: '2026-10-14T09:20:00Z',
    content: {
      text: 'How do you decide what to cache in a read-heavy API?',
      answerNotes: 'Hit rate, staleness tolerance, invalidation cost.',
      tags: { technology: ['Architecture'] },
    },
    history: [entry('h15', REVIEW_HISTORY_EVENT.SUBMITTED, JORDAN, '2026-10-14T09:20:00Z')],
  },
  {
    id: 'mock-9',
    isMine: false,
    kind: REVIEW_KIND.NEW,
    status: REVIEW_STATUS.CHANGES_REQUESTED,
    submitter: SAM,
    submittedAt: '2026-10-12T12:00:00Z',
    content: {
      text: 'What is a closure?',
      answerNotes: 'A function with its lexical scope.',
      tags: { technology: ['JavaScript'] },
    },
    decision: {
      note: 'Add what a strong answer covers beyond the definition.',
      decidedBy: MOCK_REVIEWER,
      decidedAt: '2026-10-13T15:30:00Z',
    },
    history: [
      entry(
        'h16',
        REVIEW_HISTORY_EVENT.CHANGES_REQUESTED,
        MOCK_REVIEWER,
        '2026-10-13T15:30:00Z',
        'Add what a strong answer covers beyond the definition.',
      ),
      entry('h17', REVIEW_HISTORY_EVENT.SUBMITTED, SAM, '2026-10-12T12:00:00Z'),
    ],
  },
];
