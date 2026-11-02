export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/account/password',
  MY_QUESTIONS: '/my-questions',
  SAVED: '/saved',
  QUESTION_DETAIL: '/questions/:questionId',
  NOTIFICATIONS: '/notifications',
  IMPORT: '/import',
  REVIEW_QUEUE: '/review',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_CLIENT_FOLDER: '/admin/clients/:clientId',
  ADMIN_MEMBERS: '/admin/members',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  NOT_FOUND: '*',
} as const;

export const CLIENT_ID_PARAM = 'clientId';
export const QUESTION_ID_PARAM = 'questionId';

export const clientFolderPath = (clientId: string): string =>
  `${ROUTES.ADMIN_CLIENTS}/${encodeURIComponent(clientId)}`;

export const questionDetailPath = (questionId: string): string =>
  `/questions/${encodeURIComponent(questionId)}`;
