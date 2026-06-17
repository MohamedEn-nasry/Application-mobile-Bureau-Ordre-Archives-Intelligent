import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { AuthSession } from '../entities/AuthSession';
import { AuthRepository } from '../repositories/AuthRepository';

export interface RefreshTokenParams {
  email: string;
  refreshToken: string;
}

export class RefreshTokenUseCase
  implements UseCase<AuthSession, RefreshTokenParams>
{
  constructor(private authRepository: AuthRepository) {}

  async execute(params: RefreshTokenParams): Promise<Result<AuthSession>> {
    return await this.authRepository.refresh(params.email, params.refreshToken);
  }
}
