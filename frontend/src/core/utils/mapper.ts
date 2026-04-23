/**
 * Base mapper interface for transforming data between layers
 */
export interface Mapper<TFrom, TTo> {
  toDomain(from: TFrom): TTo;
  fromDomain(to: TTo): TFrom;
}

/**
 * Abstract base mapper with common functionality
 */
export abstract class BaseMapper<TFrom, TTo> implements Mapper<TFrom, TTo> {
  abstract toDomain(from: TFrom): TTo;
  abstract fromDomain(to: TTo): TFrom;

  /**
   * Map array of items
   */
  toDomainArray(fromArray: TFrom[]): TTo[] {
    return fromArray.map(item => this.toDomain(item));
  }

  /**
   * Map array to domain
   */
  fromDomainArray(toArray: TTo[]): TFrom[] {
    return toArray.map(item => this.fromDomain(item));
  }

  /**
   * Safe mapping with null/undefined handling
   */
  safeToDomain(from: TFrom | null | undefined): TTo | null {
    return from ? this.toDomain(from) : null;
  }

  /**
   * Safe mapping from domain
   */
  safeFromDomain(to: TTo | null | undefined): TFrom | null {
    return to ? this.fromDomain(to) : null;
  }
}

/**
 * Generic mapper for simple object transformations
 */
export class GenericMapper<TFrom, TTo> extends BaseMapper<TFrom, TTo> {
  constructor(
    private toDomainFn: (from: TFrom) => TTo,
    private fromDomainFn: (to: TTo) => TFrom
  ) {
    super();
  }

  toDomain(from: TFrom): TTo {
    return this.toDomainFn(from);
  }

  fromDomain(to: TTo): TFrom {
    return this.fromDomainFn(to);
  }
}

/**
 * Identity mapper for when no transformation is needed
 */
export class IdentityMapper<T> implements Mapper<T, T> {
  toDomain(from: T): T {
    return from;
  }

  fromDomain(to: T): T {
    return to;
  }
}

/**
 * Composition mapper for chaining transformations
 */
export class CompositeMapper<TFrom, TMiddle, TTo> implements Mapper<TFrom, TTo> {
  constructor(
    private firstMapper: Mapper<TFrom, TMiddle>,
    private secondMapper: Mapper<TMiddle, TTo>
  ) {}

  toDomain(from: TFrom): TTo {
    const middle = this.firstMapper.toDomain(from);
    return this.secondMapper.toDomain(middle);
  }

  fromDomain(to: TTo): TFrom {
    const middle = this.secondMapper.fromDomain(to);
    return this.firstMapper.fromDomain(middle);
  }
}
