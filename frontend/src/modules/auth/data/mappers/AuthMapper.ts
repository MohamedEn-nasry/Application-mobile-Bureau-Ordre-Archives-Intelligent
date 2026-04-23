import { BaseMapper } from '../../../../core/utils/mapper';
import { LoginCredentials, LoginResponse } from '../../domain/repositories/AuthRepository';
import { LoginCredentialsAPI, LoginResponseAPI } from '../datasources/AuthRemoteDataSource';

/**
 * Mapper for transforming between domain and API authentication data
 */
export class AuthMapper extends BaseMapper<LoginCredentialsAPI, LoginCredentials> {
  /**
   * Convert API credentials to domain credentials
   */
  toDomain(from: LoginCredentialsAPI): LoginCredentials {
    return {
      identifier: from.identifier.trim(),
      password: from.password,
    };
  }

  /**
   * Convert domain credentials to API credentials
   */
  fromDomain(to: LoginCredentials): LoginCredentialsAPI {
    return {
      identifier: to.identifier.trim(),
      password: to.password,
    };
  }

  /**
   * Convert API login response to domain login response
   */
  toLoginResponseDomain(from: LoginResponseAPI): LoginResponse {
    return {
      user: from.user, // This will be mapped by UserMapper in the data source
      role: from.role,
    };
  }

  /**
   * Convert domain login response to API login response
   */
  fromLoginResponseDomain(to: LoginResponse): LoginResponseAPI {
    return {
      user: to.user, // This will be mapped by UserMapper in the data source
      accessToken: to.user.accessToken,
      refreshToken: to.user.refreshToken,
      expiresIn: Math.floor((to.user.expiresAt.getTime() - Date.now()) / 1000),
      role: to.role,
    };
  }
}
