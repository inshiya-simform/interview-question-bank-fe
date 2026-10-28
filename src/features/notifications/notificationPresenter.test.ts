import { describe, expect, it } from 'vitest';
import { NOTIFICATION_TYPE, ROUTES } from '@/constants';
import { presentNotification } from './notificationPresenter';

const make = (type: string, data: Record<string, unknown>) => ({
  id: '1',
  type,
  data,
  read: false,
  createdAt: '2026-01-01T00:00:00.000Z',
});

describe('presentNotification', () => {
  it('varies the title for edits', () => {
    const data = { questionId: 'q', questionText: 'Q?', reviewerName: 'Rae', isEdit: true };
    expect(presentNotification(make(NOTIFICATION_TYPE.QUESTION_APPROVED, data)).title).toBe(
      'Your edit was approved',
    );
    expect(
      presentNotification(make(NOTIFICATION_TYPE.QUESTION_REJECTED, { ...data, note: null })).title,
    ).toBe('Edit rejected');
  });

  it('links submissions to the review queue and grants to the client filter', () => {
    const submitted = make(NOTIFICATION_TYPE.QUESTION_SUBMITTED, {
      questionId: 'q',
      questionText: 'Q?',
      submitterName: 'Sam',
      reason: 'edited',
    });
    expect(presentNotification(submitted)).toMatchObject({
      title: 'Question edited, review needed',
      href: ROUTES.REVIEW_QUEUE,
    });
    const granted = make(NOTIFICATION_TYPE.CLIENT_ACCESS_GRANTED, {
      clientId: 'c1',
      clientName: 'Acme',
    });
    expect(presentNotification(granted).href).toBe(`${ROUTES.HOME}?client=c1`);
    const revoked = make(NOTIFICATION_TYPE.CLIENT_ACCESS_REVOKED, {
      clientId: 'c1',
      clientName: 'Acme',
    });
    expect(presentNotification(revoked).href).toBe(ROUTES.HOME);
  });

  it('falls back for unknown types and drifted data', () => {
    const unknown = presentNotification(make('SOMETHING_NEW', {}));
    expect(unknown.href).toBe(ROUTES.NOTIFICATIONS);
    expect(presentNotification(make(NOTIFICATION_TYPE.IMPORT_FINISHED, {}))).toEqual(unknown);
  });
});
