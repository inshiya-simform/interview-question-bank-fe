import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it } from 'vitest';
import { applyIncomingNotification, applyMarkRead } from './notification-cache';
import { QUERY_KEYS } from './query-keys';
import type { NotificationListResponse } from './type/notifications/notifications-list';
import type { Notification } from './type/notifications/shared';

const USER = 'u1';
const make = (id: string, read = false): Notification => ({
  id,
  type: 'IMPORT_FINISHED',
  data: { count: 1 },
  read,
  createdAt: '2026-01-01T00:00:00.000Z',
});
const list = (items: Notification[], total = items.length): NotificationListResponse => ({
  items,
  page: 1,
  limit: 2,
  total,
  unreadCount: 1,
});

let queryClient: QueryClient;
const allKey = QUERY_KEYS.NOTIFICATIONS(USER, { status: 'all', page: 1, limit: 2 });
const unreadKey = QUERY_KEYS.NOTIFICATIONS(USER, { status: 'unread', page: 1, limit: 2 });
const page2Key = QUERY_KEYS.NOTIFICATIONS(USER, { status: 'all', page: 2, limit: 2 });
const countKey = QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT(USER);

beforeEach(() => {
  queryClient = new QueryClient();
  queryClient.setQueryData(allKey, list([make('a', true), make('b')]));
  queryClient.setQueryData(unreadKey, list([make('b')]));
  queryClient.setQueryData(page2Key, list([make('c')], 3));
  queryClient.setQueryData(countKey, { unreadCount: 1 });
});

describe('applyIncomingNotification', () => {
  it('prepends to first pages, caps at limit, and bumps counts', () => {
    applyIncomingNotification(queryClient, USER, make('new'));
    const all = queryClient.getQueryData<NotificationListResponse>(allKey);
    expect(all?.items.map((n) => n.id)).toEqual(['new', 'a']);
    expect(all?.total).toBe(3);
    expect(all?.unreadCount).toBe(2);
    expect(queryClient.getQueryData<NotificationListResponse>(unreadKey)?.items[0]?.id).toBe('new');
    expect(queryClient.getQueryData(countKey)).toEqual({ unreadCount: 2 });
  });

  it('leaves later pages untouched', () => {
    applyIncomingNotification(queryClient, USER, make('new'));
    expect(queryClient.getQueryData<NotificationListResponse>(page2Key)?.items).toHaveLength(1);
  });

  it('dedupes by id without double counting', () => {
    applyIncomingNotification(queryClient, USER, make('b'));
    expect(queryClient.getQueryData<NotificationListResponse>(allKey)?.total).toBe(2);
    expect(queryClient.getQueryData(countKey)).toEqual({ unreadCount: 1 });
  });

  it('does not touch the unread count for an already-read notification', () => {
    applyIncomingNotification(queryClient, USER, make('new', true));
    expect(queryClient.getQueryData(countKey)).toEqual({ unreadCount: 1 });
    expect(queryClient.getQueryData<NotificationListResponse>(unreadKey)?.items).toHaveLength(1);
  });
});

describe('applyMarkRead', () => {
  it('marks read, removes from the unread view and decrements', () => {
    applyMarkRead(queryClient, USER, 'b');
    expect(queryClient.getQueryData<NotificationListResponse>(allKey)?.items[1]?.read).toBe(true);
    expect(queryClient.getQueryData<NotificationListResponse>(unreadKey)?.items).toEqual([]);
    expect(queryClient.getQueryData(countKey)).toEqual({ unreadCount: 0 });
  });
});
