/**
 * Simple Dependency Injection Container
 * Provides centralized dependency management following Clean Architecture principles
 */

export type ServiceFactory<T> = () => T;
export type ServiceFactoryAsync<T> = () => Promise<T>;

export class DIContainer {
  private services = new Map<string, any>();
  private factories = new Map<string, ServiceFactory<any>>();
  private asyncFactories = new Map<string, ServiceFactoryAsync<any>>();
  private singletons = new Map<string, any>();

  /**
   * Register a service instance
   */
  register<T>(token: string, instance: T): void {
    this.services.set(token, instance);
  }

  /**
   * Register a service factory function
   */
  registerFactory<T>(token: string, factory: ServiceFactory<T>): void {
    this.factories.set(token, factory);
  }

  /**
   * Register an async service factory function
   */
  registerAsyncFactory<T>(token: string, factory: ServiceFactoryAsync<T>): void {
    this.asyncFactories.set(token, factory);
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(token: string, factory: ServiceFactory<T>): void {
    this.singletons.set(token, { factory, instance: null });
  }

  /**
   * Register an async singleton service
   */
  registerAsyncSingleton<T>(token: string, factory: ServiceFactoryAsync<T>): void {
    this.singletons.set(token, { factory, instance: null, isAsync: true });
  }

  /**
   * Resolve a service
   */
  resolve<T>(token: string): T {
    // Check for direct instance
    if (this.services.has(token)) {
      return this.services.get(token);
    }

    // Check for factory
    if (this.factories.has(token)) {
      const factory = this.factories.get(token);
      if (factory) {
        return factory();
      }
    }

    // Check for singleton
    if (this.singletons.has(token)) {
      const singleton = this.singletons.get(token);
      if (singleton && !singleton.instance) {
        singleton.instance = singleton.factory();
      }
      if (singleton) {
        return singleton.instance;
      }
    }

    throw new Error(`Service not found: ${token}`);
  }

  /**
   * Resolve an async service
   */
  async resolveAsync<T>(token: string): Promise<T> {
    // Check for direct instance
    if (this.services.has(token)) {
      return this.services.get(token);
    }

    // Check for factory
    if (this.factories.has(token)) {
      const factory = this.factories.get(token);
      if (factory) {
        return factory();
      }
    }

    // Check for async factory
    if (this.asyncFactories.has(token)) {
      const asyncFactory = this.asyncFactories.get(token);
      if (asyncFactory) {
        return asyncFactory();
      }
    }

    // Check for singleton
    if (this.singletons.has(token)) {
      const singleton = this.singletons.get(token);
      if (singleton && !singleton.instance) {
        if (singleton.isAsync) {
          singleton.instance = await singleton.factory();
        } else {
          singleton.instance = singleton.factory();
        }
      }
      if (singleton) {
        return singleton.instance;
      }
    }

    throw new Error(`Service not found: ${token}`);
  }

  /**
   * Check if a service is registered
   */
  isRegistered(token: string): boolean {
    return (
      this.services.has(token) ||
      this.factories.has(token) ||
      this.asyncFactories.has(token) ||
      this.singletons.has(token)
    );
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.services.clear();
    this.factories.clear();
    this.asyncFactories.clear();
    this.singletons.clear();
  }

  /**
   * Remove a specific service
   */
  remove(token: string): boolean {
    return (
      this.services.delete(token) ||
      this.factories.delete(token) ||
      this.asyncFactories.delete(token) ||
      this.singletons.delete(token)
    );
  }
}

// Global container instance
export const container = new DIContainer();

// Service tokens (constants for dependency keys)
export const SERVICE_TOKENS = {
  // Core services
  API_CLIENT: 'ApiClient',
  
  // Auth services
  AUTH_REPOSITORY: 'AuthRepository',
  LOGIN_USE_CASE: 'LoginUseCase',
  LOGOUT_USE_CASE: 'LogoutUseCase',
  CHECK_AUTH_USE_CASE: 'CheckAuthUseCase',
  GET_CURRENT_USER_USE_CASE: 'GetCurrentUserUseCase',
  
  // User management services
  USER_MANAGEMENT_REPOSITORY: 'UserManagementRepository',
  GET_USERS_USE_CASE: 'GetUsersUseCase',
  CREATE_USER_USE_CASE: 'CreateUserUseCase',
  
  // Add more tokens as needed
} as const;
