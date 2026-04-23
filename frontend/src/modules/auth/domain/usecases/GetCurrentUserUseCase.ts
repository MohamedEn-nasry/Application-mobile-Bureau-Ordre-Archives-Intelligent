import { UseCase, NoParams } from '@core/base/UseCase';
import { Result, ok, fail } from '@core/utils/result';
import { AuthRepository } from '@modules/auth/domain/repositories/AuthRepository';
import { AuthSession } from '@modules/auth/domain/entities/AuthSession';
import { BusinessLogicFailure } from '@core/error/failures';

/**
 * Get current user use case
 * Retrieves the currently authenticated user session
 */
export class GetCurrentUserUseCase implements UseCase<AuthSession | null, NoParams> {
  constructor(private readonly authRepository: AuthRepository) {
  }

  /**
   * Execute get current user use case
   */
  async execute(): Promise<Result<AuthSession | null>> {
    try {
      // Get current session
      const sessionResult = await this.authRepository.getCurrentSession();
      if (sessionResult.isError()) {
        return sessionResult;
      }

      const session = sessionResult.value;

      // If no session, return null
      if (!session || !session.isAuthenticated) {
        return ok(null);
      }

      // Validate session is not expired
      const isExpired = 'isExpired' in session && typeof session.isExpired === 'function' 
        ? session.isExpired() 
        : new Date() >= session.expiresAt;
      
      if (isExpired) {
        // Clear expired session
        await this.authRepository.clearSession();
        return ok(null);
      }

      return ok(session);

    } catch (error) {
      return fail(
        new BusinessLogicFailure('Get current user failed', 'GET_CURRENT_USER_ERROR')
      );
    }
  }
}
