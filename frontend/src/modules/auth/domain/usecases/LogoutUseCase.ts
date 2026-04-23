import { UseCase, NoParams } from '@core/base/UseCase';
import { Result, ok, fail } from '@core/utils/result';
import { AuthRepository } from '@modules/auth/domain/repositories/AuthRepository';
import { BusinessLogicFailure } from '@core/error/failures';

/**
 * Logout use case
 * Handles user logout and session cleanup
 */
export class LogoutUseCase implements UseCase<void, NoParams> {
  constructor(private readonly authRepository: AuthRepository) {
  }

  /**
   * Execute logout use case
   */
  async execute(): Promise<Result<void>> {
    try {
      // Clear session from repository
      const clearResult = await this.authRepository.clearSession();
      if (clearResult.isError()) {
        return clearResult;
      }

      // Perform logout
      const logoutResult = await this.authRepository.logout();
      if (logoutResult.isError()) {
        return logoutResult;
      }

      return ok(undefined);

    } catch (error) {
      return fail(
        new BusinessLogicFailure('Logout operation failed', 'LOGOUT_ERROR')
      );
    }
  }
}
