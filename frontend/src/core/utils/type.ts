/**
 * Type utility functions and common types
 */

/**
 * Make all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties of T required recursively
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Omit properties that extend the specified type
 */
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * Pick properties that extend the specified type
 */
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/**
 * Extract the element type of an array
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * Extract the return type of a function
 */
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

/**
 * Extract the parameter types of a function
 */
export type Parameters<T> = T extends (...args: infer P) => any ? P : never;

/**
 * Create a type that is either T or a Promise of T
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Create a type that represents the constructor of T
 */
export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Create a type that represents the keys of T that are optional
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Create a type that represents the keys of T that are required
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Create a type that removes null and undefined from T
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Create a type that makes T nullable
 */
export type Nullable<T> = T | null | undefined;

/**
 * Create a type that represents the ID field of an entity
 */
export type EntityId = string | number;

/**
 * Create a base entity interface
 */
export interface BaseEntity {
  id: EntityId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a type for API responses
 */
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

/**
 * Create a type for paginated responses
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Create a type for search filters
 */
export interface SearchFilters {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

/**
 * Type guard utilities
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function';
};

export const isDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

export const isNullOrUndefined = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};
