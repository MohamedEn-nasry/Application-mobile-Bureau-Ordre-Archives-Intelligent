import { EntityId } from '../utils/type';

/**
 * Base entity interface for all domain entities
 * Follows Clean Architecture principles - pure domain objects
 */
export interface BaseEntity {
  readonly id: EntityId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Base entity implementation with common functionality
 */
export abstract class BaseEntityImpl implements BaseEntity {
  constructor(
    public readonly id: EntityId,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Check if this entity equals another entity
   */
  equals(other: BaseEntity): boolean {
    return this.id === other.id;
  }

  /**
   * Get a string representation of this entity
   */
  toString(): string {
    return `${this.constructor.name}(id=${this.id})`;
  }

  /**
   * Create a copy of this entity with updated timestamp
   */
  withUpdatedTimestamp(): BaseEntity {
    return Object.create(Object.getPrototypeOf(this), {
      ...Object.getOwnPropertyDescriptors(this),
      updatedAt: { value: new Date(), writable: false, configurable: false }
    });
  }
}
