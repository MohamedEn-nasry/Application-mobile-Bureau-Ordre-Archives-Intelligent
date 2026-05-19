import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { ManagedUser } from '../entities/ManagedUser';
import { UserManagementRepository } from '../repositories/UserManagementRepository';
import { Role } from '../../../../shared/constants/roles';

export interface CreateUserParams {
  firstname: string;
  lastname: string;
  email: string;
  roleName: string;
  password: string;
  isActive: boolean;
  imagePath?: string;
}

export class CreateUserUseCase implements UseCase<ManagedUser, CreateUserParams> {
  constructor(private repo: UserManagementRepository) { }

  async execute(params: CreateUserParams): Promise<Result<ManagedUser>> {
    return await this.repo.createUser(params.firstname, params.lastname, params.email, params.roleName, params.password, params.isActive, params.imagePath);
  }
}
