import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { AuthRepository } from '../repositories/AuthRepository';

export class LogoutUseCase implements UseCase<void, NoParams> {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<Result<void>> {
    return await this.authRepository.logout();
  }
}
