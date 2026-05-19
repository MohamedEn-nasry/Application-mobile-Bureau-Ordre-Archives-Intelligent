import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { UserManagementRepository } from '../repositories/UserManagementRepository';

interface UpdateUserParams {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roleName: string;
  isActive: boolean;
  imagePath?: string;
}

export class UpdateUserUseCase implements UseCase<boolean, UpdateUserParams> {
  constructor(private repo: UserManagementRepository) { }

  async execute(params: UpdateUserParams): Promise<Result<boolean>> {
    return await this.repo.updateUser(
      params.id,
      params.firstname,
      params.lastname,
      params.email,
      params.roleName,
      params.isActive,
      params.imagePath
    );
  }
}
