import { Result } from '@core/utils/result';
import { AuthSession } from '@modules/auth/domain/entities/AuthSession';

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  readonly identifier: string; // email or username
  readonly password: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  readonly user: AuthSession;
  readonly role: string;
}

/**
 * Authentication repository interface
 * Defines the contract for authentication operations
 */
export interface AuthRepository {
  /**
   * Authenticate user with credentials
   */
  login(credentials: LoginCredentials): Promise<Result<LoginResponse>>;

  /**
   * Logout current user
   */
  logout(): Promise<Result<void>>;

  /**
   * Refresh authentication token
   */
  refreshToken(refreshToken: string): Promise<Result<AuthSession>>;

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): Promise<Result<boolean>>;

  /**
   * Get current authenticated session
   */
  getCurrentSession(): Promise<Result<AuthSession | null>>;

  /**
   * Save authentication session
   */
  saveSession(session: AuthSession): Promise<Result<void>>;

  /**
   * Clear authentication session
   */
  clearSession(): Promise<Result<void>>;

  /**
   * Validate access token
   */
  validateToken(token: string): Promise<Result<boolean>>;

  /**
   * Change user password
   */
  changePassword(oldPassword: string, newPassword: string): Promise<Result<void>>;

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Promise<Result<void>>;

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Promise<Result<void>>;
}
