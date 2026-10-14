export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  QUESTIONS: {
    BASE: '/questions',
    BY_ID: (id: string) => `/questions/${id}`,
  },
  CLIENTS: {
    BASE: '/clients',
  },
  TAGS: {
    BASE: '/tags',
  },
} as const;
