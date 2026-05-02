import { User } from "../entities/UserEntitie";

export interface AuthRepository {
  login(email: string, password: string): Promise<User>;
}
