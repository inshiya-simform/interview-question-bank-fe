export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  MY_QUESTIONS: '/my-questions',
  IMPORT: '/import',
  REVIEW_QUEUE: '/review',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_CLIENT_FOLDER: '/admin/clients/:clientId',
  ADMIN_MEMBERS: '/admin/members',
} as const;

export const CLIENT_ID_PARAM = 'clientId';

export const clientFolderPath = (clientId: string): string =>
  `${ROUTES.ADMIN_CLIENTS}/${encodeURIComponent(clientId)}`;
