import { Result, safeAsync } from '@core/utils/result';

/**
 * HTTP request configuration
 */
export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * Network error types
 */
export enum NetworkErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Custom network error
 */
export class NetworkError extends Error {
  constructor(
    public type: NetworkErrorType,
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Base API Client that handles HTTP requests with proper error handling
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(
    baseUrl: string,
    defaultHeaders: Record<string, string> = {},
    defaultTimeout: number = 10000
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authentication token
   */
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Make HTTP request with proper error handling
   */
  async request<T>(config: RequestConfig): Promise<Result<ApiResponse<T>>> {
    return safeAsync(async () => {
      const { url, method = 'GET', headers = {}, body, params, timeout = this.defaultTimeout } = config;
      
      // Build full URL
      let fullUrl = `${this.baseUrl}${url}`;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        fullUrl += `?${searchParams.toString()}`;
      }

      // Prepare request
      const requestInit: RequestInit = {
        method,
        headers: { ...this.defaultHeaders, ...headers },
        signal: AbortSignal.timeout(timeout),
      };

      if (body && method !== 'GET') {
        requestInit.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      // Make request
      const response = await fetch(fullUrl, requestInit);
      
      // Parse response
      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = (await response.text()) as unknown as T;
      } else {
        data = (await response.blob()) as unknown as T;
      }

      // Handle error responses
      if (!response.ok) {
        throw this.createNetworkError(response.status, data);
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseHeaders(response.headers),
      };
    });
  }

  /**
   * Convenience methods
   */
  get<T>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<Result<ApiResponse<T>>> {
    return this.request<T>({ url, method: 'GET', params, headers });
  }

  post<T>(url: string, body?: any, headers?: Record<string, string>): Promise<Result<ApiResponse<T>>> {
    return this.request<T>({ url, method: 'POST', body, headers });
  }

  put<T>(url: string, body?: any, headers?: Record<string, string>): Promise<Result<ApiResponse<T>>> {
    return this.request<T>({ url, method: 'PUT', body, headers });
  }

  patch<T>(url: string, body?: any, headers?: Record<string, string>): Promise<Result<ApiResponse<T>>> {
    return this.request<T>({ url, method: 'PATCH', body, headers });
  }

  delete<T>(url: string, headers?: Record<string, string>): Promise<Result<ApiResponse<T>>> {
    return this.request<T>({ url, method: 'DELETE', headers });
  }

  /**
   * Create appropriate network error based on status code
   */
  private createNetworkError(status: number, response: any): NetworkError {
    switch (status) {
      case 401:
        return new NetworkError(NetworkErrorType.UNAUTHORIZED, 'Unauthorized access', status, response);
      case 403:
        return new NetworkError(NetworkErrorType.FORBIDDEN, 'Access forbidden', status, response);
      case 404:
        return new NetworkError(NetworkErrorType.NOT_FOUND, 'Resource not found', status, response);
      case 400:
      case 422:
        return new NetworkError(NetworkErrorType.CLIENT_ERROR, 'Client error', status, response);
      case 500:
      case 502:
      case 503:
      case 504:
        return new NetworkError(NetworkErrorType.SERVER_ERROR, 'Server error', status, response);
      default:
        return new NetworkError(NetworkErrorType.UNKNOWN_ERROR, 'Unknown error', status, response);
    }
  }

  /**
   * Parse headers from Headers object
   */
  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}
