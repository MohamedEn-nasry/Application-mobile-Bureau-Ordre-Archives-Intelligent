import { Role } from "../../../../shared/constants/roles";
import { ManagedUser } from '../../domain/entities/ManagedUser';
import { UserResponseModel } from '../datasources/UserManagementRemoteDataSource';


export class UserManagementMapper {
  static toDomain(model: UserResponseModel): ManagedUser {
    return new ManagedUser(
      model.id.toString(),
      model.firstname,
      model.lastname,
      model.email,
      model.roleName as Role,
      model.isActif,
      new Date(model.createdAt),
      new Date(model.updatedAt),
      model.imagePath
    );
  }

  static toDomainList(models: UserResponseModel[]): ManagedUser[] {
    return models.map(this.toDomain);
  }
}
