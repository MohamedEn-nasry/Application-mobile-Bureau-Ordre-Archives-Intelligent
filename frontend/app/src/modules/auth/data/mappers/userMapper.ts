import { User } from "../../domain/entities/UserEntitie";
import { UserModel } from "../models/UserModel";
import { Role } from "../../../../shared/constants/roles";

export function toUserEntity(model: UserModel): User {
  return {
    id: model.id,
    name: model.fullName,
    email: model.email,
    role: model.role as Role,
  };
}
