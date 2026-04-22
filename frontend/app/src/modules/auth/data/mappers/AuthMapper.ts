import { AuthSession } from "../../domain/entities/AuthSession";
import { AuthResponseModel } from "../datasources/AuthRemoteDataSource";
import { Role } from "../../../../shared/constants/roles";

export class AuthMapper {
  static toDomain(model: AuthResponseModel): AuthSession {
    return new AuthSession(
      model.token,
      model.user.id,
      model.user.email,
      model.user.role as Role,
    );
  }
}
