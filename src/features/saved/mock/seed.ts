import type { Question } from '@/api';
import type { SavedEntry } from '../types';

const SEED_TIME = '2026-01-01T00:00:00.000Z';

const question = (id: string, text: string, answer: string, tags: Question['tags']): Question => ({
  id,
  text,
  answerNotes: `<p>${answer}</p>`,
  tags,
  authorId: 'mock-author',
  createdAt: SEED_TIME,
  updatedAt: SEED_TIME,
});

const MOCK_QUESTIONS = [
  question(
    'mock-q1',
    'What is a closure in JavaScript, and when would you use one?',
    'A function that remembers the variables of the scope it was created in. Useful for private state, factories and callbacks.',
    { technology: ['JavaScript'], seniority: ['Mid'] },
  ),
  question(
    'mock-q2',
    'Explain the difference between useMemo and useCallback.',
    'useMemo caches a computed value; useCallback caches a function identity. Both only help when a measured re-render cost exists.',
    { technology: ['React'], seniority: ['Mid'] },
  ),
  question(
    'mock-q3',
    'How does the browser event loop schedule microtasks?',
    'Microtasks such as promise callbacks run after the current task and before the next macrotask or render.',
    { technology: ['JavaScript'], seniority: ['Senior'] },
  ),
  question(
    'mock-q4',
    'How would you design a rate limiter for a public API?',
    'Cover token bucket vs sliding window, where counters live, per-key limits and how clients are told to back off.',
    { technology: ['System design'], seniority: ['Senior'] },
  ),
  question(
    'mock-q5',
    'When would you choose a message queue over a direct API call?',
    'Decoupling, buffering bursts, retries and fan-out, at the cost of eventual consistency and operational overhead.',
    { technology: ['System design'], seniority: ['Mid'] },
  ),
];

export const SEED_COLLECTIONS = [
  { id: 'mock-frontend', name: 'Frontend' },
  { id: 'mock-system-design', name: 'System design' },
  { id: 'mock-behavioural', name: 'Behavioural' },
] as const;

const entry = (index: number, collectionId: string): SavedEntry => ({
  question: MOCK_QUESTIONS[index],
  collectionId,
  savedAt: index,
});

export const SEED_ENTRIES: readonly SavedEntry[] = [
  entry(0, 'mock-frontend'),
  entry(1, 'mock-frontend'),
  entry(2, 'mock-frontend'),
  entry(3, 'mock-system-design'),
  entry(4, 'mock-system-design'),
];
