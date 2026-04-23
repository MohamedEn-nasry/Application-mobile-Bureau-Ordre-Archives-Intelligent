import { BaseModelImpl } from '../../../../core/base/BaseModel';

/**
 * User roles enum for data layer
 */
export enum UserRoleModel {
  ADMIN = 'Admin',
  AGENT = 'Agent',
  LECTEUR = 'Lecteur',
}

/**
 * User status enum for data layer
 */
export enum UserStatusModel {
  ACTIVE = 'Active',
  DISABLED = 'Disabled',
  INACTIVE = 'Inactive',
}

/**
 * User data model
 * Represents user data from external sources (API, database, etc.)
 */
export interface UserModel extends BaseModelImpl {
  id?: string | number;
  fullName?: string;
  username?: string;
  email?: string;
  role?: UserRoleModel;
  status?: UserStatusModel;
  initials?: string;
  lastLogin?: string;
  phone?: string;
}

/**
 * User model implementation
 */
export class UserModelImpl extends BaseModelImpl implements UserModel {
  public fullName?: string;
  public username?: string;
  public email?: string;
  public role?: UserRoleModel;
  public status?: UserStatusModel;
  public initials?: string;
  public lastLogin?: string;
  public phone?: string;

  /**
   * Validate user model structure
   */
  validate(): boolean {
    return !!(this.id && this.fullName && this.email && this.role);
  }

  /**
   * Create from API response
   */
  static fromAPI(data: any): UserModel {
    const model = new UserModelImpl();
    Object.assign(model, {
      id: data.id,
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      role: data.role,
      status: data.status || UserStatusModel.ACTIVE,
      initials: data.initials,
      lastLogin: data.lastLogin,
      phone: data.phone,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
    return model;
  }

  /**
   * Convert to API payload
   */
  toAPIPayload(): Record<string, any> {
    const payload = super.toAPIPayload();
    
    // Convert role enum to string
    if (this.role) {
      payload.role = this.role;
    }
    
    // Convert status enum to string
    if (this.status) {
      payload.status = this.status;
    }
    
    return payload;
  }
}
