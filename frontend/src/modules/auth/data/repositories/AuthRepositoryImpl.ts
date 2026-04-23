import { success, failure, AsyncResult } from '../../../../core/utils/result';
import { AuthRepository, LoginCredentials, LoginResponse } from '../../domain/repositories/AuthRepository';
import { AuthSession } from '../../domain/entities/AuthSession';
import { AuthRemoteDataSource } from '../datasources/AuthRemoteDataSource';
import { TokenStorage } from '../../../../core/storage/tokenStorage';
import { TokenValidator } from '../../../../core/storage/tokenStorage';
import { AuthenticationFailure, BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Authentication repository implementation
 * Implements the AuthRepository interface using remote data source and local storage
 */
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly remoteDataSource: AuthRemoteDataSource,
    private readonly tokenStorage: TokenStorage
  ) {}

  /**
   * Authenticate user with credentials
   */
  async login(credentials: LoginCredentials): AsyncResult<LoginResponse> {
    try {
      // Call remote data source
      const result = await this.remoteDataSource.login(credentials);
      
      if (result.isFailure()) {
        return result;
      }

      const response = result.value;

      // Save tokens to storage
      await this.saveTokens(response.user.accessToken, response.user.refreshToken);

      // Save session to storage
      await this.saveSession(response.user);

      return success(response);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Login operation failed', 'LOGIN_ERROR')
      );
    }
  }

  /**
   * Logout current user
   */
  async logout(): AsyncResult<void> {
    try {
      // Call remote logout
      await this.remoteDataSource.logout();

      // Clear local storage
      await this.clearSession();

      return success(undefined);

    } catch (error) {
      // Even if remote logout fails, clear local storage
      await this.clearSession();
      return success(undefined);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): AsyncResult<AuthSession> {
    try {
      // Validate refresh token
      if (!refreshToken || TokenValidator.isTokenExpired(refreshToken)) {
        return failure(new AuthenticationFailure('Refresh token is expired'));
      }

      // Call remote data source
      const result = await this.remoteDataSource.refreshToken(refreshToken);
      
      if (result.isFailure()) {
        return result;
      }

      const session = result.value;

      // Save new tokens
      await this.saveTokens(session.accessToken, session.refreshToken);

      // Save session
      await this.saveSession(session);

      return success(session);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Token refresh failed', 'REFRESH_ERROR')
      );
    }
  }

  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated(): AsyncResult<boolean> {
    try {
      // Get access token
      const tokenResult = await this.tokenStorage.getAccessToken();
      
      if (tokenResult.isFailure()) {
        return failure(tokenResult.error);
      }

      const token = tokenResult.value;

      // Check if token exists and is not expired
      if (!token || TokenValidator.isTokenExpired(token)) {
        return success(false);
      }

      return success(true);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Authentication check failed', 'AUTH_CHECK_ERROR')
      );
    }
  }

  /**
   * Get current authenticated session
   */
  async getCurrentSession(): AsyncResult<AuthSession | null> {
    try {
      // Check if authenticated
      const isAuthResult = await this.isAuthenticated();
      if (isAuthResult.isFailure() || !isAuthResult.value) {
        return success(null);
      }

      // Get current user from remote
      const result = await this.remoteDataSource.getCurrentUser();
      
      if (result.isFailure()) {
        // If remote call fails, clear session and return null
        await this.clearSession();
        return success(null);
      }

      const session = result.value;

      // Save updated session
      await this.saveSession(session);

      return success(session);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Get current session failed', 'GET_SESSION_ERROR')
      );
    }
  }

  /**
   * Save authentication session
   */
  async saveSession(session: AuthSession): AsyncResult<void> {
    try {
      // Save tokens
      await this.saveTokens(session.accessToken, session.refreshToken);

      // Note: In a real implementation, you might want to save the full session
      // For now, we're just saving tokens and getting user data from API when needed
      return success(undefined);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Save session failed', 'SAVE_SESSION_ERROR')
      );
    }
  }

  /**
   * Clear authentication session
   */
  async clearSession(): AsyncResult<void> {
    try {
      // Clear all tokens
      await this.tokenStorage.clearAll();

      return success(undefined);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Clear session failed', 'CLEAR_SESSION_ERROR')
      );
    }
  }

  /**
   * Validate access token
   */
  async validateToken(token: string): AsyncResult<boolean> {
    try {
      // Check if token is expired
      if (TokenValidator.isTokenExpired(token)) {
        return success(false);
      }

      // Token is valid (not expired)
      return success(true);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Token validation failed', 'VALIDATE_TOKEN_ERROR')
      );
    }
  }

  /**
   * Change user password
   */
  async changePassword(oldPassword: string, newPassword: string): AsyncResult<void> {
    try {
      const result = await this.remoteDataSource.changePassword(oldPassword, newPassword);
      return result;

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Change password failed', 'CHANGE_PASSWORD_ERROR')
      );
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): AsyncResult<void> {
    try {
      const result = await this.remoteDataSource.requestPasswordReset(email);
      return result;

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Password reset request failed', 'RESET_REQUEST_ERROR')
      );
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): AsyncResult<void> {
    try {
      const result = await this.remoteDataSource.resetPassword(token, newPassword);
      return result;

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Password reset failed', 'RESET_PASSWORD_ERROR')
      );
    }
  }

  /**
   * Helper method to save tokens
   */
  private async saveTokens(accessToken: string, refreshToken?: string): Promise<void> {
    await this.tokenStorage.setAccessToken(accessToken);
    if (refreshToken) {
      await this.tokenStorage.setRefreshToken(refreshToken);
    }
  }
}
