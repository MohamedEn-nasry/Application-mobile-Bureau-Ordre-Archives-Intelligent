import { User } from "../../domain/entities/UserEntitie";
import { UserModel } from "../models/UserModel";

export function toUserEntity(model: UserModel): User {
  return {
    id: model.id,
    name: model.name,
    email: model.email,
  };
}
