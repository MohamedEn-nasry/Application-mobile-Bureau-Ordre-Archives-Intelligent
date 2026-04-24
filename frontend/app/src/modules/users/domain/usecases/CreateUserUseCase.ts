import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { ManagedUser } from '../entities/ManagedUser';
import { UserManagementRepository } from '../repositories/UserManagementRepository';
import { Role } from '../../../../shared/constants/roles';

export interface CreateUserParams {
  FirstName: string;
  LastName: string;
  email: string;
  role: Role;
  password: string;
  ImagePath?: string;
}

export class CreateUserUseCase implements UseCase<ManagedUser, CreateUserParams> {
  constructor(private repo: UserManagementRepository) { }

  async execute(params: CreateUserParams): Promise<Result<ManagedUser>> {
    return await this.repo.createUser(params.FirstName, params.LastName, params.email, params.role, params.password);
  }
}
