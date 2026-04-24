import { UserManagementRepository } from '../../domain/repositories/UserManagementRepository';
import { ManagedUser } from '../../domain/entities/ManagedUser';
import { Result, ok, fail } from '../../../../core/utils/result';
import { UserManagementRemoteDataSource } from '../datasources/UserManagementRemoteDataSource';
import { ServerFailure } from '../../../../core/error/failures';
import { Role } from '../../../../shared/constants/roles';

export class UserManagementRepositoryImpl implements UserManagementRepository {
  constructor(private remoteDataSource: UserManagementRemoteDataSource) { }

  async createUser(FirstName: string, LastName: string, email: string, role: Role, password?: string, ImagePath?: string): Promise<Result<ManagedUser>> {
    try {
      const response = await this.remoteDataSource.createUser(FirstName, LastName, email, role, password, ImagePath);
      const user = new ManagedUser(response.id, response.FirstName, response.LastName, response.email, response.role as Role, response.isActive, response.createdAt, response.updatedAt, response.ImagePath);
      return ok(user);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async getUsers(): Promise<Result<ManagedUser[]>> {
    try {
      const response = await this.remoteDataSource.getUsers();
      const users = response.map(r => new ManagedUser(r.id, r.FirstName, r.LastName, r.email, r.role as Role, r.isActive, r.createdAt, r.updatedAt, r.ImagePath));
      return ok(users);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }
}
