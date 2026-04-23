import { BaseEntity } from '../../../../../core/base/BaseEntity';

/**
 * User roles enum
 */
export enum UserRole {
  ADMIN = 'Admin',
  AGENT = 'Agent',
  LECTEUR = 'Lecteur',
}

/**
 * User status enum
 */
export enum UserStatus {
  ACTIVE = 'Active',
  DISABLED = 'Disabled',
  INACTIVE = 'Inactive',
}

/**
 * User domain entity
 * Pure domain object with no external dependencies
 */
export interface User extends BaseEntity {
  readonly fullName: string;
  readonly username: string;
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly initials: string;
  readonly lastLogin?: Date;
  readonly phone?: string;
}

/**
 * User entity implementation
 */
export class UserImpl extends BaseEntity implements User {
  constructor(
    id: string,
    public readonly fullName: string,
    public readonly username: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly status: UserStatus,
    public readonly initials: string,
    public readonly lastLogin?: Date,
    public readonly phone?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    super(id, createdAt, updatedAt);
  }

  /**
   * Check if user is active
   */
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Check if user has admin role
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Check if user has agent role
   */
  isAgent(): boolean {
    return this.role === UserRole.AGENT;
  }

  /**
   * Check if user has reader role
   */
  isLecteur(): boolean {
    return this.role === UserRole.LECTEUR;
  }

  /**
   * Create a copy with updated information
   */
  withUpdates(updates: Partial<Omit<User, 'id' | 'createdAt'>>): User {
    return new UserImpl(
      this.id,
      updates.fullName ?? this.fullName,
      updates.username ?? this.username,
      updates.email ?? this.email,
      updates.role ?? this.role,
      updates.status ?? this.status,
      updates.initials ?? this.initials,
      updates.lastLogin ?? this.lastLogin,
      updates.phone ?? this.phone,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Update last login time
   */
  withLastLogin(lastLogin: Date = new Date()): User {
    return this.withUpdates({ lastLogin });
  }

  /**
   * Deactivate user
   */
  deactivate(): User {
    return this.withUpdates({ status: UserStatus.DISABLED });
  }

  /**
   * Activate user
   */
  activate(): User {
    return this.withUpdates({ status: UserStatus.ACTIVE });
  }
}
