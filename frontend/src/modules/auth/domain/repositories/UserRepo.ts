import { Result, AsyncResult } from '../../../../../core/utils/result';
import { User, UserRole, UserStatus } from '../entities/UserEntitie';

/**
 * User creation parameters
 */
export interface CreateUserParams {
  readonly fullName: string;
  readonly username: string;
  readonly email: string;
  readonly role: UserRole;
  readonly phone?: string;
}

/**
 * User update parameters
 */
export interface UpdateUserParams {
  readonly fullName?: string;
  readonly username?: string;
  readonly email?: string;
  readonly role?: UserRole;
  readonly status?: UserStatus;
  readonly phone?: string;
}

/**
 * User search filters
 */
export interface UserFilters {
  readonly role?: UserRole;
  readonly status?: UserStatus;
  readonly query?: string;
  readonly page?: number;
  readonly limit?: number;
}

/**
 * Paginated user list response
 */
export interface UserListResponse {
  readonly users: User[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

/**
 * User repository interface
 * Defines the contract for user management operations
 */
export interface UserRepository {
  /**
   * Get user by ID
   */
  findById(id: string): AsyncResult<User>;

  /**
   * Get user by email or username
   */
  findByIdentifier(identifier: string): AsyncResult<User>;

  /**
   * Get list of users with optional filters
   */
  getUsers(filters?: UserFilters): AsyncResult<UserListResponse>;

  /**
   * Create a new user
   */
  createUser(params: CreateUserParams): AsyncResult<User>;

  /**
   * Update an existing user
   */
  updateUser(id: string, params: UpdateUserParams): AsyncResult<User>;

  /**
   * Delete a user
   */
  deleteUser(id: string): AsyncResult<void>;

  /**
   * Update user status
   */
  updateUserStatus(id: string, status: UserStatus): AsyncResult<User>;

  /**
   * Check if user exists by email
   */
  existsByEmail(email: string): AsyncResult<boolean>;

  /**
   * Check if user exists by username
   */
  existsByUsername(username: string): AsyncResult<boolean>;

  /**
   * Get users by role
   */
  getUsersByRole(role: UserRole): AsyncResult<User[]>;

  /**
   * Update user's last login
   */
  updateLastLogin(id: string): AsyncResult<User>;
}
