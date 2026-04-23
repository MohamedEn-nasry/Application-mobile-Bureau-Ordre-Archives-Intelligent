/**
 * API configuration and setup
 * Centralizes API configuration for the application
 */

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  defaultHeaders: Record<string, string>;
  enableLogging: boolean;
  retryAttempts: number;
  retryDelay: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'https://api.bureau-ordre.com',
  timeout: 10000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  enableLogging: process.env.NODE_ENV === 'development',
  retryAttempts: 3,
  retryDelay: 1000,
};

/**
 * API configuration manager
 */
export class ApiConfigManager {
  private config: ApiConfig;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...DEFAULT_API_CONFIG, ...config };
  }

  getConfig(): ApiConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  setBaseUrl(baseUrl: string): void {
    this.config.baseUrl = baseUrl;
  }

  setTimeout(timeout: number): void {
    this.config.timeout = timeout;
  }

  setDefaultHeader(key: string, value: string): void {
    this.config.defaultHeaders[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.config.defaultHeaders[key];
  }

  enableLogging(): void {
    this.config.enableLogging = true;
  }

  disableLogging(): void {
    this.config.enableLogging = false;
  }
}

/**
 * Global API configuration instance
 */
export const apiConfig = new ApiConfigManager();
