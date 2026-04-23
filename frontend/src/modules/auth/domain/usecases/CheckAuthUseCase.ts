import { UseCase, NoParams } from '@core/base/UseCase';
import { Result, ok, fail } from '@core/utils/result';
import { AuthRepository } from '@modules/auth/domain/repositories/AuthRepository';
import { BusinessLogicFailure } from '@core/error/failures';

/**
 * Check authentication use case
 * Verifies if user is currently authenticated
 */
export class CheckAuthUseCase implements UseCase<boolean, NoParams> {
  constructor(private readonly authRepository: AuthRepository) {
  }

  /**
   * Execute check authentication use case
   */
  async execute(): Promise<Result<boolean>> {
    try {
      // Check if user is authenticated
      const isAuthResult = await this.authRepository.isAuthenticated();
      if (isAuthResult.isError()) {
        return isAuthResult;
      }

      return ok(isAuthResult.value);

    } catch (error) {
      return fail(
        new BusinessLogicFailure('Check authentication failed', 'CHECK_AUTH_ERROR')
      );
    }
  }
}
