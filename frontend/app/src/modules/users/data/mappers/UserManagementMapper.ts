import { Role } from "../../../../shared/constants/roles";
import { ManagedUser } from '../../domain/entities/ManagedUser';
import { UserResponseModel } from '../datasources/UserManagementRemoteDataSource';


export class UserManagementMapper {
  static toDomain(model: UserResponseModel): ManagedUser {
    return new ManagedUser(
      model.id,
      model.FirstName,
      model.LastName,
      model.email,
      model.role as Role,
      model.isActive,
      model.createdAt,
      model.updatedAt,
      model.ImagePath
    );
  }

  static toDomainList(models: UserResponseModel[]): ManagedUser[] {
    return models.map(this.toDomain);
  }
}
