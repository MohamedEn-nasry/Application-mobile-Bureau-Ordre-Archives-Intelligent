import { Result } from '../../../../core/utils/result';
import { ManagedUser } from '../entities/ManagedUser';
import { Role } from '../../../../shared/constants/roles';

export interface UserManagementRepository {
  createUser(firstname: string, lastname: string, email: string, roleName: string, password: string, isActive: boolean, imagePath?: string): Promise<Result<ManagedUser>>;
  getUsers(): Promise<Result<ManagedUser[]>>;
}
