import { success, failure, AsyncResult } from '../../../../core/utils/result';
import { NetworkFailure, AuthenticationFailure } from '../../../../core/error/failures';
import { ApiClient } from '../../../../core/network/apiClient';
import { API_ENDPOINTS } from '../../../../core/network/endpoints';
import { LoginResponse } from '../../domain/repositories/AuthRepository';
import { AuthSession, AuthSessionImpl } from '../../domain/entities/AuthSession';
import { UserMapper } from '../mappers/userMapper';
import { UserModelImpl } from '../models/UserModel';

/**
 * Credentials interface for API
 */
export interface LoginCredentialsAPI {
  identifier: string;
  password: string;
}

/**
 * Login response from API
 */
export interface LoginResponseAPI {
  user: any;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  role: string;
}

/**
 * Authentication remote data source
 * Handles all remote API calls for authentication
 */
export class AuthRemoteDataSource {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly userMapper: UserMapper
  ) {}

  /**
   * Login with credentials
   */
  async login(credentials: LoginCredentialsAPI): AsyncResult<LoginResponse> {
    try {
      const response = await this.apiClient.post<LoginResponseAPI>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;

      // Map user data to domain entity
      const userModel = UserModelImpl.fromAPI(data.user);
      const user = this.userMapper.toDomain(userModel);

      // Create auth session
      const authSession = AuthSessionImpl.createFromLogin(
        user,
        data.accessToken,
        data.refreshToken,
        data.expiresIn
      );

      return success({
        user: authSession,
        role: data.role,
      });

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          return failure(new AuthenticationFailure('Invalid credentials'));
        }
        if (error.message.includes('Network') || error.message.includes('fetch')) {
          return failure(new NetworkFailure('Network error during login'));
        }
      }
      return failure(new NetworkFailure('Login failed', undefined, error as Error));
    }
  }

  /**
   * Logout current user
   */
  async logout(): AsyncResult<void> {
    try {
      const response = await this.apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);

      if (response.isFailure()) {
        return failure(response.error);
      }

      return success(undefined);

    } catch (error) {
      // Even if logout fails, we don't want to block the user
      // Just log the error and continue
      console.warn('Logout API call failed:', error);
      return success(undefined);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): AsyncResult<AuthSession> {
    try {
      const response = await this.apiClient.post<{ user: any; accessToken: string; refreshToken?: string; expiresIn: number }>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;

      // Map user data to domain entity
      const userModel = UserModelImpl.fromAPI(data.user);
      const user = this.userMapper.toDomain(userModel);

      // Create new auth session
      const authSession = AuthSessionImpl.createFromLogin(
        user,
        data.accessToken,
        data.refreshToken,
        data.expiresIn
      );

      return success(authSession);

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          return failure(new AuthenticationFailure('Refresh token expired'));
        }
      }
      return failure(new NetworkFailure('Token refresh failed', undefined, error as Error));
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): AsyncResult<AuthSession> {
    try {
      const response = await this.apiClient.get<{ user: any; accessToken: string; refreshToken?: string; expiresIn: number }>(
        API_ENDPOINTS.AUTH.ME
      );

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;

      // Map user data to domain entity
      const userModel = UserModelImpl.fromAPI(data.user);
      const user = this.userMapper.toDomain(userModel);

      // Create auth session
      const authSession = AuthSessionImpl.createFromLogin(
        user,
        data.accessToken,
        data.refreshToken,
        data.expiresIn
      );

      return success(authSession);

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          return failure(new AuthenticationFailure('Not authenticated'));
        }
      }
      return failure(new NetworkFailure('Get current user failed', undefined, error as Error));
    }
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): AsyncResult<void> {
    try {
      const response = await this.apiClient.post(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        { oldPassword, newPassword }
      );

      if (response.isFailure()) {
        return failure(response.error);
      }

      return success(undefined);

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('400') || error.message.includes('Invalid')) {
          return failure(new AuthenticationFailure('Invalid old password'));
        }
      }
      return failure(new NetworkFailure('Change password failed', undefined, error as Error));
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): AsyncResult<void> {
    try {
      const response = await this.apiClient.post(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      );

      if (response.isFailure()) {
        return failure(response.error);
      }

      return success(undefined);

    } catch (error) {
      return failure(new NetworkFailure('Password reset request failed', undefined, error as Error));
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): AsyncResult<void> {
    try {
      const response = await this.apiClient.post(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        { token, newPassword }
      );

      if (response.isFailure()) {
        return failure(response.error);
      }

      return success(undefined);

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('400') || error.message.includes('Invalid')) {
          return failure(new AuthenticationFailure('Invalid reset token'));
        }
      }
      return failure(new NetworkFailure('Password reset failed', undefined, error as Error));
    }
  }
}
