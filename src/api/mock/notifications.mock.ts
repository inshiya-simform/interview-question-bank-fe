import { NOTIFICATION_TYPE } from '@/constants';
import type { Notification } from '../type/notifications/shared';

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const ago = (ms: number): string => new Date(Date.now() - ms).toISOString();

const approved = (id: string, question: string, ageMs: number, isRead: boolean): Notification => ({
  id,
  type: NOTIFICATION_TYPE.QUESTION_APPROVED,
  title: 'Your question was approved',
  body: `“${question}” is now live in the bank.`,
  createdAt: ago(ageMs),
  isRead,
});

const newClientQuestion = (id: string, client: string, ageMs: number, isRead: boolean) => ({
  id,
  type: NOTIFICATION_TYPE.NEW_CLIENT_QUESTION,
  title: 'New question in a client you can access',
  body: `A question was added for ${client}.`,
  createdAt: ago(ageMs),
  isRead,
});

// Placeholder data until the notifications API exists; newest first.
export function createMockNotifications(): Notification[] {
  return [
    approved('n-01', 'Explain the React reconciliation algorithm', 5 * MINUTE_MS, false),
    {
      id: 'n-02',
      type: NOTIFICATION_TYPE.CHANGES_REQUESTED,
      title: 'Changes requested',
      body: 'A reviewer asked you to add answer notes to “Difference between var, let and const”.',
      createdAt: ago(32 * MINUTE_MS),
      isRead: false,
    },
    newClientQuestion('n-03', 'Acme Corp', 2 * HOUR_MS, false),
    {
      id: 'n-04',
      type: NOTIFICATION_TYPE.IMPORT_FINISHED,
      title: 'Import finished',
      body: 'Your CSV import completed. 24 questions were added for review.',
      createdAt: ago(DAY_MS),
      isRead: true,
    },
    {
      id: 'n-05',
      type: NOTIFICATION_TYPE.PERMISSION_GRANTED,
      title: 'Permission granted',
      body: 'You can now view questions for Globex.',
      createdAt: ago(DAY_MS + 3 * HOUR_MS),
      isRead: true,
    },
    {
      id: 'n-06',
      type: NOTIFICATION_TYPE.QUESTION_REJECTED,
      title: 'Question rejected',
      body: 'A reviewer rejected “Describe event delegation”.',
      createdAt: ago(2 * DAY_MS),
      isRead: true,
    },
    approved('n-07', 'What is a closure in JavaScript', 3 * DAY_MS, true),
    newClientQuestion('n-08', 'Globex', 4 * DAY_MS, true),
    approved('n-09', 'How does useEffect cleanup work', 5 * DAY_MS, true),
    newClientQuestion('n-10', 'Initech', 6 * DAY_MS, true),
    {
      id: 'n-11',
      type: NOTIFICATION_TYPE.CHANGES_REQUESTED,
      title: 'Changes requested',
      body: 'A reviewer asked you to clarify “Explain CSS specificity”.',
      createdAt: ago(8 * DAY_MS),
      isRead: true,
    },
    approved('n-12', 'Controlled vs uncontrolled components', 9 * DAY_MS, true),
  ];
}
