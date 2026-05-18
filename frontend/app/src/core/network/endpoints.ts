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
    charts: '/dashboard/charts',
    activity: '/dashboard/activity',
    usersSummary: '/dashboard/users/summary',
  },
  users: {
    base: 'Users',
    list: 'Users/All',
    create: 'Users/Create',
    deactivate: (id: number) => `Users/deactivate/${id}`,
    activate: (id: number) => `Users/activate/${id}`,
    update: (id: number) => `Users/update/${id}`,
    byId: (id: number) => `Users/${id}`,
    changePassword: (id: number) => `Users/chgPssw/${id}`,
    summary: 'Users/summary',
    details: (id: number) => `/Users/${id}`,
    searchByEmail: (email: string) =>
      `/Users/search-by-email?email=${encodeURIComponent(email)}`,
    assignCategory: (userId: number, categoryId: number) =>
      `/Users/${userId}/assign-category/${categoryId}`,
  },
  notifications: {
    list: '/Notifications',
    unreadCount: '/Notifications/unread-count',
    markAsRead: (id: number) => `/Notifications/${id}/read`,
    markAllAsRead: '/Notifications/read-all',
    delete: (id: number) => `/Notifications/${id}`,
    lecteur: () => '/Notifications/lecteur',
  },
  courriers: {
    list: '/Courriers',
    getById: (id: number) => `/Courriers/${id}`,
    create: '/Courriers',
    update: (id: number) => `/Courriers/${id}`,
    updateStatus: (id: number) => `/Courriers/${id}/status`,
    delete: (id: number) => `/Courriers/${id}`,
    assigned: (userId: number) => `/Courriers/assigned/${userId}`,
    search: '/Courriers/search',
    agentIncoming: '/Courriers/agent/incoming',
    agentOutgoing: '/Courriers/agent/outgoing',
    reassign: (id: number) => `/Courriers/${id}/reassign`,
    history: (id: number) => `/Courriers/${id}/history`,
    lecteur: '/Courriers/lecteur',
  },
  categories: {
    list: '/Categories',
    getById: (id: number) => `/Categories/${id}`,
  },

  reports: {
    overview: (period: string) => `/Reports/overview?period=${period}`,
  },

  agentDashboard: {
    overview: '/agent/dashboard/overview',
    ocrResults: '/agent/dashboard/ocr-results',

  },


  piecesJointes: {
    upload: (courrierId: number) => `/PiecesJointes/courrier/${courrierId}`,
    getByCourrierId: (courrierId: number) => `/PiecesJointes/courrier/${courrierId}`,
    ocrPreviewFile: '/PiecesJointes/ocr/preview-file',
    ocrConfirm: (id: number) => `/PiecesJointes/${id}/ocr/confirm`,
    imageBase64: (id: number) => `/PiecesJointes/${id}/image-base64`,

  },

  lecteurDashboard: {
    overview: '/LecteurDashboard/overview',
  },

} as const;
