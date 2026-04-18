export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/me',
  },
  archives: {
    base: '/archives',
    byId: (id: string) => `/archives/${id}`,
  },
  documents: {
    base: '/documents',
    upload: '/documents/upload',
    byId: (id: string) => `/documents/${id}`,
  },
  courrier: {
    base: '/courriers',
    byId: (id: string) => `/courriers/${id}`,
  },
  dashboard: {
    stats: '/dashboard/stats',
  }
} as const;
