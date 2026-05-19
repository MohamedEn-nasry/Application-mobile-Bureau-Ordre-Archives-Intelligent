import { Result } from '../../../../core/utils/result';
import { ChangePasswordDTO } from '../../../../shared/domain/entities/ChangePassword';
import { UserManagementRepository } from '../repositories/UserManagementRepository';

type ChangePasswordParams = {
  id: number;
  oldPassword: string;
  newPassword: string;
};

export class ChangePasswordUseCase {
  constructor(private repo: UserManagementRepository) {}

  async execute(params: ChangePasswordParams): Promise<Result<boolean>> {
    const dto: ChangePasswordDTO = {
      Id: params.id,
      OldPassword: params.oldPassword,
      NewPassword: params.newPassword,
    };

    return await this.repo.changePassword(dto);
  }
}

