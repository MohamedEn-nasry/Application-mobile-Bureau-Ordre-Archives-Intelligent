import { Result, ok, fail } from '@core/utils/result';
import { ValidationFailure } from '@core/error/failures';

/**
 * Base repository interface that all repositories must extend
 * Defines the contract for data operations
 */
export interface BaseRepository<T, ID = string> {
  /**
   * Find an entity by its ID
   */
  findById(id: ID): Promise<Result<T>>;

  /**
   * Find all entities
   */
  findAll(): Promise<Result<T[]>>;

  /**
   * Create a new entity
   */
  create(entity: Omit<T, 'id'>): Promise<Result<T>>;

  /**
   * Update an existing entity
   */
  update(id: ID, entity: Partial<T>): Promise<Result<T>>;

  /**
   * Delete an entity
   */
  delete(id: ID): Promise<Result<void>>;

  /**
   * Check if an entity exists
   */
  exists(id: ID): Promise<Result<boolean>>;
}

/**
 * Abstract base repository implementation
 * Provides common functionality and enforces the Result pattern
 */
export abstract class BaseRepositoryImpl<T, ID = string> implements BaseRepository<T, ID> {
  
  /**
   * Template method for finding by ID
   * Subclasses must implement the actual data access logic
   */
  abstract findById(id: ID): Promise<Result<T>>;

  /**
   * Template method for finding all entities
   */
  abstract findAll(): Promise<Result<T[]>>;

  /**
   * Template method for creating entities
   */
  abstract create(entity: Omit<T, 'id'>): Promise<Result<T>>;

  /**
   * Template method for updating entities
   */
  abstract update(id: ID, entity: Partial<T>): Promise<Result<T>>;

  /**
   * Template method for deleting entities
   */
  abstract delete(id: ID): Promise<Result<void>>;

  /**
   * Template method for checking existence
   */
  abstract exists(id: ID): Promise<Result<boolean>>;

  /**
   * Helper method to validate entity before operations
   */
  protected validateEntity(entity: any): Result<void> {
    if (!entity) {
      return fail(new ValidationFailure('Entity cannot be null or undefined'));
    }
    return ok(undefined);
  }

  /**
   * Helper method to validate ID
   */
  protected validateId(id: ID): Result<void> {
    if (!id) {
      return fail(new ValidationFailure('ID cannot be null or undefined'));
    }
    return ok(undefined);
  }
}
