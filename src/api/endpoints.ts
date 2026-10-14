export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  QUESTIONS: {
    BASE: '/questions',
  },
  CLIENTS: {
    BASE: '/clients',
  },
  TAGS: {
    BASE: '/tags',
  },
} as const;
