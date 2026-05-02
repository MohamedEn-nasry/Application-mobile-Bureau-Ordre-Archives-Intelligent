import { UserManagementRepository } from '../../domain/repositories/UserManagementRepository';
import { ManagedUser } from '../../domain/entities/ManagedUser';
import { Result, ok, fail } from '../../../../core/utils/result';
import { UserManagementRemoteDataSource } from '../datasources/UserManagementRemoteDataSource';
import { ServerFailure } from '../../../../core/error/failures';
import { Role } from '../../../../shared/constants/roles';
import { ChangePasswordDTO } from '../../../../shared/domain/entities/ChangePassword';

export class UserManagementRepositoryImpl implements UserManagementRepository {
  constructor(private remoteDataSource: UserManagementRemoteDataSource) { }

  async createUser(firstname: string, lastname: string, email: string, roleName: string, password: string, isActive: boolean, imagePath?: string): Promise<Result<ManagedUser>> {
    try {
      const response = await this.remoteDataSource.createUser(firstname, lastname, email, roleName, password, isActive, imagePath);
      console.log('Create User Response:', response);

      const user = new ManagedUser(
        response.id.toString(),
        response.firstname,
        response.lastname,
        response.email,
        response.roleName as Role,
        response.isActif,
        new Date(response.createdAt),
        new Date(response.updatedAt),
        response.imagePath
      );
      return ok(user);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async getUsers(): Promise<Result<ManagedUser[]>> {
    try {
      const response = await this.remoteDataSource.getUsers();
      console.log('Get Users Response:', response);

      const users = response.map(r => new ManagedUser(
        r.id.toString(),
        r.firstname,
        r.lastname,
        r.email,
        r.roleName as Role,
        r.isActif,
        new Date(r.createdAt),
        new Date(r.updatedAt),
        r.imagePath
      ));

      return ok(users);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async getUserById(id: number): Promise<Result<ManagedUser>> {
    try {
      const response = await this.remoteDataSource.getUserById(id);
      console.log('Get User By ID Response:', response);

      const user = new ManagedUser(
        response.id.toString(),
        response.firstname,
        response.lastname,
        response.email,
        response.roleName as Role,
        response.isActif,
        new Date(response.createdAt),
        new Date(response.updatedAt),
        response.imagePath
      );

      return ok(user);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async deactivateUser(id: number): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.deactivateUser(id);
      console.log('Deactivate User Response:', response);
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async activateUser(id: number): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.activateUser(id);
      console.log('Activate User Response:', response);
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async updateUser(id: number, firstname: string, lastname: string, email: string, roleName: string, isActive: boolean, imagePath?: string): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.updateUser(id, { firstname, lastname, email, roleName, isActive, imagePath });
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async changePassword(dto: ChangePasswordDTO): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.changePassword(dto);
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }
}
