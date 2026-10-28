import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NOTIFICATION_TYPE } from '@/constants';
import { handleIncomingNotification } from './liveNotification';

vi.mock('react-toastify', () => ({ toast: { info: vi.fn() } }));

const make = (type: string, data: Record<string, unknown>) => ({
  id: type,
  type,
  data,
  read: false,
  createdAt: '2026-01-01T00:00:00.000Z',
});

beforeEach(() => vi.mocked(toast.info).mockClear());

describe('handleIncomingNotification', () => {
  it('toasts important types', () => {
    handleIncomingNotification(
      new QueryClient(),
      'u1',
      make(NOTIFICATION_TYPE.CLIENT_ACCESS_GRANTED, { clientId: 'c', clientName: 'Acme' }),
    );
    expect(toast.info).toHaveBeenCalledOnce();
  });

  it.each([
    make(NOTIFICATION_TYPE.QUESTION_SUBMITTED, {
      questionId: 'q',
      questionText: 'T',
      submitterName: 'S',
      reason: 'submitted',
    }),
    make(NOTIFICATION_TYPE.CLIENT_QUESTION_ADDED, {
      questionId: 'q',
      questionText: 'T',
      clientId: 'c',
      clientName: null,
    }),
    make('SOMETHING_NEW', {}),
  ])('does not toast $type', (notification) => {
    handleIncomingNotification(new QueryClient(), 'u1', notification);
    expect(toast.info).not.toHaveBeenCalled();
  });
});
