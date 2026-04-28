import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { ManagedUser } from '../entities/ManagedUser';
import { UserManagementRepository } from '../repositories/UserManagementRepository';

export class GetUsersUseCase implements UseCase<ManagedUser[], NoParams> {
  constructor(private repo: UserManagementRepository) {}

  async execute(): Promise<Result<ManagedUser[]>> {
    return await this.repo.getUsers();
  }
}
