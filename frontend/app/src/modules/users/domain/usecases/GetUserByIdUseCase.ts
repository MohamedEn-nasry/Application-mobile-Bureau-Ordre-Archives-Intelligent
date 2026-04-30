import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { ManagedUser } from '../entities/ManagedUser';
import { UserManagementRepository } from '../repositories/UserManagementRepository';

export class GetUserByIdUseCase implements UseCase<ManagedUser, number> {
  constructor(private repo: UserManagementRepository) {}

  async execute(id: number): Promise<Result<ManagedUser>> {
    return await this.repo.getUserById(id);
  }
}
