import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { AuthRepository } from '../repositories/AuthRepository';

export interface LogoutParams {
  email: string;
  refreshToken: string;
}

export class LogoutUseCase implements UseCase<void, LogoutParams> {
  constructor(private authRepository: AuthRepository) {}

  async execute(params: LogoutParams): Promise<Result<void>> {
    return await this.authRepository.logout(params.email, params.refreshToken);
  }
}
