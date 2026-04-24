import { Result } from '../../../../core/utils/result';
import { ManagedUser } from '../entities/ManagedUser';
import { Role } from '../../../../shared/constants/roles';

export interface UserManagementRepository {
  createUser(FirstName: string, LastName: string, email: string, role: Role, password?: string, ImagePath?: string): Promise<Result<ManagedUser>>;
  getUsers(): Promise<Result<ManagedUser[]>>;
}
