/**
 * API endpoints configuration
 * Centralized endpoint management for the application
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    
    CHANGE_PASSWORD: '/auth/change-password',
    ME: '/auth/me',
  },

  // User management endpoints
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },

  // Mail/courier endpoints
  MAIL: {
    INCOMING: '/mail/incoming',
    OUTGOING: '/mail/outgoing',
    GET: (id: string) => `/mail/${id}`,
    CREATE_INCOMING: '/mail/incoming',
    CREATE_OUTGOING: '/mail/outgoing',
    UPDATE: (id: string) => `/mail/${id}`,
    DELETE: (id: string) => `/mail/${id}`,
    HISTORY: '/mail/history',
  },

  // Document endpoints
  DOCUMENTS: {
    LIST: '/documents',
    GET: (id: string) => `/documents/${id}`,
    UPLOAD: '/documents/upload',
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
    DELETE: (id: string) => `/documents/${id}`,
    SEARCH: '/documents/search',
  },

  // Archive endpoints
  ARCHIVES: {
    LIST: '/archives',
    GET: (id: string) => `/archives/${id}`,
    CREATE: '/archives',
    UPDATE: (id: string) => `/archives/${id}`,
    DELETE: (id: string) => `/archives/${id}`,
    SEARCH: '/archives/search',
  },

  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_MAIL: '/dashboard/recent-mail',
    PENDING_TASKS: '/dashboard/pending-tasks',
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
  },

  // Reports endpoints
  REPORTS: {
    GENERATE: '/reports/generate',
    LIST: '/reports',
    GET: (id: string) => `/reports/${id}`,
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
  },

  // Settings endpoints
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    ROLES: '/settings/roles',
    PERMISSIONS: '/settings/permissions',
  },
} as const;

/**
 * Type-safe endpoint builder
 */
export class EndpointBuilder {
  constructor(private baseUrl: string) {}

  /**
   * Build full URL from endpoint
   */
  build(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Build parameterized endpoint
   */
  buildWithParams(endpoint: (id: string) => string, id: string): string {
    return this.build(endpoint(id));
  }

  /**
   * Build URL with query parameters
   */
  buildWithQuery(endpoint: string, params: Record<string, any>): string {
    const url = this.build(endpoint);
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    return `${url}?${searchParams.toString()}`;
  }
}
