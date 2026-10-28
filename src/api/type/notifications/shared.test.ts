import { describe, expect, it } from 'vitest';
import { notificationListResponseSchema } from './notifications-list';
import { notificationSchema, parseNotificationPayload } from './shared';

const base = { id: 'n1', read: false, createdAt: '2026-01-01T00:00:00.000Z' };

describe('notificationSchema', () => {
  it('accepts a type the frontend does not know yet', () => {
    const parsed = notificationSchema.parse({ ...base, type: 'SOMETHING_NEW', data: { a: 1 } });
    expect(parsed.type).toBe('SOMETHING_NEW');
    expect(parseNotificationPayload(parsed)).toBeNull();
  });

  it('keeps the list parse alive when one item has an unknown type', () => {
    const result = notificationListResponseSchema.safeParse({
      items: [{ ...base, type: 'SOMETHING_NEW', data: {} }],
      page: 1,
      limit: 20,
      total: 1,
      unreadCount: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe('parseNotificationPayload', () => {
  it('narrows a known type', () => {
    const payload = parseNotificationPayload({
      type: 'QUESTION_REJECTED',
      data: { questionId: 'q', questionText: 'T', reviewerName: 'R', note: null, isEdit: false },
    });
    expect(payload?.type).toBe('QUESTION_REJECTED');
  });

  it('returns null when the data drifted from its type', () => {
    expect(parseNotificationPayload({ type: 'IMPORT_FINISHED', data: { count: 'x' } })).toBeNull();
  });
});
