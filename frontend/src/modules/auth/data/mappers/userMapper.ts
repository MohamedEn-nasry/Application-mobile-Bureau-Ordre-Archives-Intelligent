import { BaseMapper } from '../../../../core/utils/mapper';
import { User, UserRole, UserStatus, UserImpl } from '../../domain/entities/UserEntitie';
import { UserModel, UserModelImpl, UserRoleModel, UserStatusModel } from '../models/UserModel';

/**
 * Mapper for transforming between User domain entities and User data models
 */
export class UserMapper extends BaseMapper<UserModel, User> {
  /**
   * Convert UserModel to User domain entity
   */
  toDomain(from: UserModel): User {
    if (!from.id) {
      throw new Error('UserModel must have an ID to convert to domain entity');
    }

    return new UserImpl(
      from.id.toString(),
      from.fullName || '',
      from.username || '',
      from.email || '',
      this.mapRole(from.role),
      this.mapStatus(from.status),
      from.initials || this.generateInitials(from.fullName),
      from.lastLogin ? new Date(from.lastLogin) : undefined,
      from.phone,
      from.created_at ? new Date(from.created_at) : new Date(),
      from.updated_at ? new Date(from.updated_at) : new Date()
    );
  }

  /**
   * Convert User domain entity to UserModel
   */
  fromDomain(to: User): UserModel {
    const model = new UserModelImpl();
    model.id = to.id;
    model.fullName = to.fullName;
    model.username = to.username;
    model.email = to.email;
    model.role = this.mapRoleToModel(to.role);
    model.status = this.mapStatusToModel(to.status);
    model.initials = to.initials;
    model.lastLogin = to.lastLogin?.toISOString();
    model.phone = to.phone;
    model.created_at = to.createdAt.toISOString();
    model.updated_at = to.updatedAt.toISOString();
    
    return model;
  }

  /**
   * Map role from model to domain
   */
  private mapRole(role?: UserRoleModel): UserRole {
    switch (role) {
      case UserRoleModel.ADMIN:
        return UserRole.ADMIN;
      case UserRoleModel.AGENT:
        return UserRole.AGENT;
      case UserRoleModel.LECTEUR:
        return UserRole.LECTEUR;
      default:
        return UserRole.AGENT; // Default fallback
    }
  }

  /**
   * Map role from domain to model
   */
  private mapRoleToModel(role: UserRole): UserRoleModel {
    switch (role) {
      case UserRole.ADMIN:
        return UserRoleModel.ADMIN;
      case UserRole.AGENT:
        return UserRoleModel.AGENT;
      case UserRole.LECTEUR:
        return UserRoleModel.LECTEUR;
      default:
        return UserRoleModel.AGENT; // Default fallback
    }
  }

  /**
   * Map status from model to domain
   */
  private mapStatus(status?: UserStatusModel): UserStatus {
    switch (status) {
      case UserStatusModel.ACTIVE:
        return UserStatus.ACTIVE;
      case UserStatusModel.DISABLED:
        return UserStatus.DISABLED;
      case UserStatusModel.INACTIVE:
        return UserStatus.INACTIVE;
      default:
        return UserStatus.ACTIVE; // Default fallback
    }
  }

  /**
   * Map status from domain to model
   */
  private mapStatusToModel(status: UserStatus): UserStatusModel {
    switch (status) {
      case UserStatus.ACTIVE:
        return UserStatusModel.ACTIVE;
      case UserStatus.DISABLED:
        return UserStatusModel.DISABLED;
      case UserStatus.INACTIVE:
        return UserStatusModel.INACTIVE;
      default:
        return UserStatusModel.ACTIVE; // Default fallback
    }
  }

  /**
   * Generate initials from full name
   */
  private generateInitials(fullName?: string): string {
    if (!fullName) return '';
    
    return fullName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
}
