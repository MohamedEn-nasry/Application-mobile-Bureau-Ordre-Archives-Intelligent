import { ManagedUser } from '../../domain/entities/ManagedUser';
import { UserResponseModel } from '../datasources/UserManagementRemoteDataSource';

export class UserManagementMapper {
  static toDomain(model: UserResponseModel): ManagedUser {
    return new ManagedUser(
      model.id,
      model.email,
      model.role as any,
      model.active
    );
  }

  static toDomainList(models: UserResponseModel[]): ManagedUser[] {
    return models.map(this.toDomain);
  }
}
