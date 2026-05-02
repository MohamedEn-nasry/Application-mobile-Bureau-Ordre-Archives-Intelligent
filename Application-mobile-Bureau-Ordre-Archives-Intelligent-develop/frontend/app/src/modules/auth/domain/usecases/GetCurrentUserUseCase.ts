import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { AuthSession } from '../entities/AuthSession';
import { AuthRepository } from '../repositories/AuthRepository';

/**
 * Usecase to get the current authenticated user's session data.
 * This can be used to refresh profile data if needed.
 */
export class GetCurrentUserUseCase implements UseCase<AuthSession | null, NoParams> {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<Result<AuthSession | null>> {
    return await this.authRepository.getSession();
  }
}
