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
    IMPORT: '/questions/import',
    EXPORT: '/questions/export',
    TEMPLATE: '/questions/import/template',
    CHECK_DUPLICATE: '/questions/check-duplicate',
    COUNTS: '/questions/counts',
    SUBMISSIONS: '/questions/submissions',
    HISTORY: (id: string) => `/questions/${id}/history`,
    APPROVE: (id: string) => `/questions/${id}/approve`,
    REQUEST_CHANGES: (id: string) => `/questions/${id}/request-changes`,
    REJECT: (id: string) => `/questions/${id}/reject`,
    REVIEW_STATE: (id: string) => `/questions/${id}/review-state`,
    REVIEW_LOCK: (id: string) => `/questions/${id}/review-lock`,
    BULK_APPROVE: '/questions/bulk/approve',
    BULK_REJECT: '/questions/bulk/reject',
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
