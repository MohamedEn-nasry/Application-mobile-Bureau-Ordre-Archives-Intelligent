import { UseCase } from '@core/base/UseCase';
import { Result, ok, fail } from '@core/utils/result';
import { AuthRepository, LoginCredentials, LoginResponse } from '@modules/auth/domain/repositories/AuthRepository';
import { AuthenticationFailure, ValidationFailure, BusinessLogicFailure } from '@core/error/failures';

/**
 * Login use case input parameters
 */
export interface LoginParams {
  readonly identifier: string;
  readonly password: string;
}

/**
 * Login use case
 * Handles user authentication with proper validation and error handling
 */
export class LoginUseCase implements UseCase<LoginResponse, LoginParams> {
  constructor(private readonly authRepository: AuthRepository) {
  }

  /**
   * Validate login input
   */
  protected validateInput(input: LoginParams): Result<void> {
    const errors: string[] = [];

    if (!input.identifier || input.identifier.trim().length === 0) {
      errors.push('Identifier is required');
    }

    if (!input.password || input.password.length === 0) {
      errors.push('Password is required');
    }

    if (input.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (errors.length > 0) {
      return fail(new ValidationFailure('Invalid login credentials', undefined, errors));
    }

    return ok(undefined);
  }

  /**
   * Execute login use case
   */
  async execute(params: LoginParams): Promise<Result<LoginResponse>> {
    // Validate input first
    const validation = this.validateInput(params);
    if (validation.isError()) {
      return validation;
    }

    try {
      // Create credentials object
      const credentials: LoginCredentials = {
        identifier: params.identifier.trim(),
        password: params.password,
      };

      // Attempt login
      const loginResult = await this.authRepository.login(credentials);
      
      if (loginResult.isError()) {
        return loginResult;
      }

      const response = loginResult.value;

      // Validate response
      if (!response.user || !response.user.isAuthenticated) {
        return fail(new AuthenticationFailure('Authentication failed'));
      }

      return ok(response);

    } catch (error) {
      return fail(
        new BusinessLogicFailure('Login operation failed', 'LOGIN_ERROR')
      );
    }
  }

}
