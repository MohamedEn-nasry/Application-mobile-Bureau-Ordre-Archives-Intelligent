import { Role } from "../../../../shared/constants/roles";
import { ManagedUser } from '../../domain/entities/ManagedUser';
import { UserResponseModel } from '../datasources/UserManagementRemoteDataSource';


export class UserManagementMapper {
  static toDomain(model: UserResponseModel): ManagedUser {
    return new ManagedUser(
      model.ID,
      model.FirstName,
      model.LastName,
      model.Email,
      model.RoleName as Role,
      model.IsActive,
      model.CreatedAt,
      model.UpdatedAt,
      model.ImagePath
    );
  }

  static toDomainList(models: UserResponseModel[]): ManagedUser[] {
    return models.map(this.toDomain);
  }
}
