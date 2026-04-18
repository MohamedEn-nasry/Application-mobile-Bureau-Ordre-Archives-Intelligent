import { UserManagementRepository } from '../../domain/repositories/UserManagementRepository';
import { ManagedUser } from '../../domain/entities/ManagedUser';
import { Result, ok, fail } from '../../../../core/utils/result';
import { UserManagementRemoteDataSource } from '../datasources/UserManagementRemoteDataSource';
import { ServerFailure } from '../../../../core/error/failures';
import { Role } from '../../../../shared/constants/roles';

export class UserManagementRepositoryImpl implements UserManagementRepository {
  constructor(private remoteDataSource: UserManagementRemoteDataSource) {}

  async createUser(email: string, role: Role, password?: string): Promise<Result<ManagedUser>> {
    try {
      const response = await this.remoteDataSource.createUser(email, role, password);
      const user = new ManagedUser(response.id, response.email, response.role as Role, response.active);
      return ok(user);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async getUsers(): Promise<Result<ManagedUser[]>> {
    try {
      const response = await this.remoteDataSource.getUsers();
      const users = response.map(r => new ManagedUser(r.id, r.email, r.role as Role, r.active));
      return ok(users);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }
}
