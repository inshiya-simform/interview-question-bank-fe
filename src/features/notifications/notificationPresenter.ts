import type { Notification, NotificationPayload } from '@/api';
import { parseNotificationPayload } from '@/api';
import type { IconName } from '@/components';
import {
  NOTIFICATION_MESSAGE_COPY as COPY,
  NOTIFICATION_TYPE,
  QUESTION_SEARCH_PARAMS,
  ROUTES,
  SUBMISSION_REASON,
} from '@/constants';
import type { NotificationType } from '@/constants';

export interface PresentedNotification {
  glyph: IconName;
  title: string;
  body: string;
  href: string;
}

type DataOf<T extends NotificationType> = Extract<NotificationPayload, { type: T }>['data'];

interface Presenter<T extends NotificationType> {
  glyph: IconName;
  title: (data: DataOf<T>) => string;
  body: (data: DataOf<T>) => string;
  href: (data: DataOf<T>) => string;
}

type PresenterMap = { [T in NotificationType]: Presenter<T> };

const questionsForClient = (clientId: string) =>
  `${ROUTES.HOME}?${new URLSearchParams({ [QUESTION_SEARCH_PARAMS.CLIENT]: clientId })}`;

// The single place that turns a type + data into copy and a deep link. The app has no
// per-question route, so question links land on the list that holds the question.
export const notificationPresenter: PresenterMap = {
  [NOTIFICATION_TYPE.CLIENT_ACCESS_GRANTED]: {
    glyph: 'members',
    title: () => COPY.CLIENT_ACCESS_GRANTED.title,
    body: (d) => COPY.CLIENT_ACCESS_GRANTED.body(d.clientName),
    href: (d) => questionsForClient(d.clientId),
  },
  [NOTIFICATION_TYPE.CLIENT_ACCESS_REVOKED]: {
    glyph: 'lock',
    title: () => COPY.CLIENT_ACCESS_REVOKED.title,
    body: (d) => COPY.CLIENT_ACCESS_REVOKED.body(d.clientName),
    href: () => ROUTES.HOME,
  },
  [NOTIFICATION_TYPE.QUESTION_APPROVED]: {
    glyph: 'check',
    title: (d) => (d.isEdit ? COPY.QUESTION_APPROVED.titleEdit : COPY.QUESTION_APPROVED.title),
    body: (d) => COPY.QUESTION_APPROVED.body(d.questionText),
    href: () => ROUTES.MY_QUESTIONS,
  },
  [NOTIFICATION_TYPE.QUESTION_CHANGES_REQUESTED]: {
    glyph: 'alert',
    title: () => COPY.QUESTION_CHANGES_REQUESTED.title,
    body: (d) => COPY.QUESTION_CHANGES_REQUESTED.body(d.reviewerName, d.questionText, d.note),
    href: () => ROUTES.MY_QUESTIONS,
  },
  [NOTIFICATION_TYPE.QUESTION_REJECTED]: {
    glyph: 'close',
    title: (d) => (d.isEdit ? COPY.QUESTION_REJECTED.titleEdit : COPY.QUESTION_REJECTED.title),
    body: (d) => COPY.QUESTION_REJECTED.body(d.reviewerName, d.questionText, d.note),
    href: () => ROUTES.MY_QUESTIONS,
  },
  [NOTIFICATION_TYPE.QUESTION_SUBMITTED]: {
    glyph: 'plus',
    title: (d) => {
      if (d.reason === SUBMISSION_REASON.EDITED) return COPY.QUESTION_SUBMITTED.titleEdited;
      if (d.reason === SUBMISSION_REASON.RESUBMITTED) {
        return COPY.QUESTION_SUBMITTED.titleResubmitted;
      }
      return COPY.QUESTION_SUBMITTED.title;
    },
    body: (d) => COPY.QUESTION_SUBMITTED.body(d.submitterName, d.questionText),
    href: () => ROUTES.REVIEW_QUEUE,
  },
  [NOTIFICATION_TYPE.CLIENT_QUESTION_ADDED]: {
    glyph: 'plus',
    title: (d) => COPY.CLIENT_QUESTION_ADDED.title(d.clientName),
    body: (d) => COPY.CLIENT_QUESTION_ADDED.body(d.questionText),
    href: (d) => questionsForClient(d.clientId),
  },
  [NOTIFICATION_TYPE.IMPORT_FINISHED]: {
    glyph: 'upload',
    title: () => COPY.IMPORT_FINISHED.title,
    body: (d) => COPY.IMPORT_FINISHED.body(d.count),
    href: () => ROUTES.MY_QUESTIONS,
  },
};

const FALLBACK: PresentedNotification = {
  glyph: 'bell',
  title: COPY.UNKNOWN_TITLE,
  body: COPY.UNKNOWN_BODY,
  href: ROUTES.NOTIFICATIONS,
};

// Present one notification; `parseNotificationPayload` narrows type and data together, and
// anything unknown or drifted gets the generic fallback.
export function presentNotification(notification: Notification): PresentedNotification {
  const payload = parseNotificationPayload(notification);
  if (!payload) return FALLBACK;
  // The map is keyed by the same discriminant, so each presenter receives its own data shape;
  // TypeScript cannot correlate the two across a union, so route through one switch.
  switch (payload.type) {
    case NOTIFICATION_TYPE.CLIENT_ACCESS_GRANTED:
      return present(notificationPresenter[payload.type], payload.data);
    case NOTIFICATION_TYPE.CLIENT_ACCESS_REVOKED:
      return present(notificationPresenter[payload.type], payload.data);
    case NOTIFICATION_TYPE.QUESTION_APPROVED:
      return present(notificationPresenter[payload.type], payload.data);
    case NOTIFICATION_TYPE.QUESTION_CHANGES_REQUESTED:
      return present(notificationPresenter[payload.type], payload.data);
    case NOTIFICATION_TYPE.QUESTION_REJECTED:
      return present(notificationPresenter[payload.type], payload.data);
    case NOTIFICATION_TYPE.QUESTION_SUBMITTED:
      return present(notificationPresenter[payload.type], payload.data);
    case NOTIFICATION_TYPE.CLIENT_QUESTION_ADDED:
      return present(notificationPresenter[payload.type], payload.data);
    case NOTIFICATION_TYPE.IMPORT_FINISHED:
      return present(notificationPresenter[payload.type], payload.data);
    default: {
      const unreachable: never = payload;
      return unreachable;
    }
  }
}

function present<D>(
  presenter: {
    glyph: IconName;
    title: (data: D) => string;
    body: (data: D) => string;
    href: (data: D) => string;
  },
  data: D,
): PresentedNotification {
  return {
    glyph: presenter.glyph,
    title: presenter.title(data),
    body: presenter.body(data),
    href: presenter.href(data),
  };
}
