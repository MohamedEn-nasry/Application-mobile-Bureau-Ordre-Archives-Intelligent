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
    activity: '/dashboard/activity',
    usersSummary: '/dashboard/users/summary',
  },
  users: {
    base: '/Users',
    list: '/Users/All',
    create: '/Users/Create',
    deactivate: (id: number) => `/Users/deactivate/${id}`,
    activate: (id: number) => `/Users/activate/${id}`,
    update: (id: number) => `/Users/Update/${id}`,
    byId: (id: number) => `/Users/${id}`,
    summary: '/Users/summary',
  }
} as const;
