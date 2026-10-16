export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    PERMISSIONS: '/auth/permissions',
  },
  QUESTIONS: {
    BASE: '/questions',
    BY_ID: (id: string) => `/questions/${id}`,
    CHECK_DUPLICATE: '/questions/check-duplicate',
  },
  CLIENTS: {
    BASE: '/clients',
  },
  ADMIN: {
    USERS: '/admin/users',
    CLIENTS: '/admin/clients',
    CLIENT_USERS: (clientId: string) => `/admin/clients/${clientId}/users`,
    CLIENT_USER: (clientId: string, userId: string) => `/admin/clients/${clientId}/users/${userId}`,
  },
  TAGS: {
    BASE: '/tags',
  },
} as const;
