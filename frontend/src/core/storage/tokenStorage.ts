import { Result } from '@core/utils/result';
import { Storage } from '@core/storage/localStorage';

/**
 * Token storage interface for managing authentication tokens
 */
export interface TokenStorage {
  getAccessToken(): Promise<Result<string | null>>;
  setAccessToken(token: string): Promise<Result<void>>;
  removeAccessToken(): Promise<Result<void>>;
  
  getRefreshToken(): Promise<Result<string | null>>;
  setRefreshToken(token: string): Promise<Result<void>>;
  removeRefreshToken(): Promise<Result<void>>;
  
  clearAll(): Promise<Result<void>>;
}

/**
 * Token storage implementation using generic storage
 */
export class TokenStorageImpl implements TokenStorage {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private storage: Storage) {}

  async getAccessToken(): Promise<Result<string | null>> {
    return this.storage.get<string>(this.ACCESS_TOKEN_KEY);
  }

  async setAccessToken(token: string): Promise<Result<void>> {
    return this.storage.set(this.ACCESS_TOKEN_KEY, token);
  }

  async removeAccessToken(): Promise<Result<void>> {
    return this.storage.remove(this.ACCESS_TOKEN_KEY);
  }

  async getRefreshToken(): Promise<Result<string | null>> {
    return this.storage.get<string>(this.REFRESH_TOKEN_KEY);
  }

  async setRefreshToken(token: string): Promise<Result<void>> {
    return this.storage.set(this.REFRESH_TOKEN_KEY, token);
  }

  async removeRefreshToken(): Promise<Result<void>> {
    return this.storage.remove(this.REFRESH_TOKEN_KEY);
  }

  async clearAll(): Promise<Result<void>> {
    const removeAccessResult = await this.removeAccessToken();
    if (removeAccessResult.isError()) {
      return removeAccessResult;
    }
    
    return this.removeRefreshToken();
  }
}

/**
 * Token validation utility
 */
export class TokenValidator {
  static isTokenExpired(token: string): boolean {
    try {
      const payload = this.parseJWT(token);
      const now = Math.floor(Date.now() / 1000);
      return payload.exp ? payload.exp < now : false;
    } catch {
      return true; // If we can't parse, consider it expired
    }
  }

  static isTokenExpiringSoon(token: string, bufferMinutes: number = 5): boolean {
    try {
      const payload = this.parseJWT(token);
      const now = Math.floor(Date.now() / 1000);
      const bufferSeconds = bufferMinutes * 60;
      return payload.exp ? payload.exp < (now + bufferSeconds) : false;
    } catch {
      return true;
    }
  }

  static parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      throw new Error('Invalid JWT token');
    }
  }

  static getTokenInfo(token: string): {
    userId?: string;
    email?: string;
    role?: string;
    exp?: number;
    iat?: number;
  } {
    try {
      const payload = this.parseJWT(token);
      return {
        userId: payload.sub || payload.userId,
        email: payload.email,
        role: payload.role,
        exp: payload.exp,
        iat: payload.iat,
      };
    } catch {
      return {};
    }
  }
}
