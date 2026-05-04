import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { ProfileRepository } from '../repositories/ProfileRepository';

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

export class ChangePasswordUseCase implements UseCase<boolean, ChangePasswordParams> {
  constructor(private repo: ProfileRepository) {}

  async execute(params: ChangePasswordParams): Promise<Result<boolean>> {
    return await this.repo.changePassword(params.currentPassword, params.newPassword);
  }
}
