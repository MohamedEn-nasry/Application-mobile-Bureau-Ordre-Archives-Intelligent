import { User } from './UserEntitie';

/**
 * Authentication session domain entity
 * Represents the current user's authentication state
 */
export interface AuthSession {
  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresAt: Date;
  readonly isAuthenticated: boolean;
  readonly deviceInfo?: DeviceInfo;
}

/**
 * Device information for session tracking
 */
export interface DeviceInfo {
  readonly deviceId: string;
  readonly deviceType: string;
  readonly platform: string;
  readonly appVersion: string;
}

/**
 * Auth session implementation
 */
export class AuthSessionImpl implements AuthSession {
  constructor(
    public readonly user: User,
    public readonly accessToken: string,
    public readonly refreshToken: string | undefined,
    public readonly expiresAt: Date,
    public readonly deviceInfo?: DeviceInfo
  ) {}

  /**
   * Get authentication status
   */
  get isAuthenticated(): boolean {
    return !!this.accessToken && !this.isExpired();
  }

  /**
   * Check if session is expired
   */
  isExpired(): boolean {
    return new Date() >= this.expiresAt;
  }

  /**
   * Check if session is expiring soon (within 5 minutes)
   */
  isExpiringSoon(bufferMinutes: number = 5): boolean {
    const bufferTime = bufferMinutes * 60 * 1000; // Convert to milliseconds
    return new Date().getTime() >= (this.expiresAt.getTime() - bufferTime);
  }

  /**
   * Create a new session with updated tokens
   */
  withTokens(accessToken: string, refreshToken?: string, expiresAt?: Date): AuthSession {
    return new AuthSessionImpl(
      this.user,
      accessToken,
      refreshToken,
      expiresAt ?? this.expiresAt,
      this.deviceInfo
    );
  }

  /**
   * Create a new session with updated user
   */
  withUser(user: User): AuthSession {
    return new AuthSessionImpl(
      user,
      this.accessToken,
      this.refreshToken,
      this.expiresAt,
      this.deviceInfo
    );
  }

  /**
   * Create a session from login credentials
   */
  static createFromLogin(
    user: User,
    accessToken: string,
    refreshToken?: string,
    expiresIn: number = 3600, // Default 1 hour
    deviceInfo?: DeviceInfo
  ): AuthSession {
    const expiresAt = new Date(Date.now() + (expiresIn * 1000));
    return new AuthSessionImpl(user, accessToken, refreshToken, expiresAt, deviceInfo);
  }

  /**
   * Create an empty session (not authenticated)
   */
  static empty(): AuthSession {
    return new AuthSessionImpl(
      {} as User, // This should never be accessed when not authenticated
      '',
      undefined,
      new Date(0)
    );
  }
}
