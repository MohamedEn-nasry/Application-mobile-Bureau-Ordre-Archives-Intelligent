import { Result } from '../../../../core/utils/result';
import { ManagedUser } from '../entities/ManagedUser';
import { ChangePasswordDTO } from '../../../../shared/domain/entities/ChangePassword';


export interface UserManagementRepository {
  createUser(firstname: string, lastname: string, email: string, roleName: string, password: string, isActive: boolean, imagePath?: string): Promise<Result<ManagedUser>>;
  getUsers(): Promise<Result<ManagedUser[]>>;
  getUserById(id: number): Promise<Result<ManagedUser>>;
  deactivateUser(id: number): Promise<Result<boolean>>;
  activateUser(id: number): Promise<Result<boolean>>;
  updateUser(id: number, firstname: string, lastname: string, email: string, roleName: string, isActive: boolean, imagePath?: string): Promise<Result<boolean>>;
  changePassword(dto: ChangePasswordDTO): Promise<Result<boolean>>;
}
