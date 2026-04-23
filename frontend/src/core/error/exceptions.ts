/**
 * Domain exceptions for unexpected errors
 * These should be used for exceptional circumstances, not expected business failures
 */

export abstract class DomainException extends Error {
  abstract readonly code: string;
  
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidEntityException extends DomainException {
  readonly code = 'INVALID_ENTITY';
  
  constructor(
    entityName: string,
    message: string = `Invalid ${entityName}`,
    cause?: Error
  ) {
    super(message, cause);
  }
}

export class RepositoryException extends DomainException {
  readonly code = 'REPOSITORY_ERROR';
  
  constructor(
    operation: string,
    message: string = `Repository operation failed: ${operation}`,
    cause?: Error
  ) {
    super(message, cause);
  }
}

export class UseCaseException extends DomainException {
  readonly code = 'USE_CASE_ERROR';
  
  constructor(
    useCaseName: string,
    message: string = `Use case execution failed: ${useCaseName}`,
    cause?: Error
  ) {
    super(message, cause);
  }
}

export class ValidationException extends DomainException {
  readonly code = 'VALIDATION_ERROR';
  
  constructor(
    message: string = 'Validation failed',
    public readonly validationErrors?: Record<string, string[]>
  ) {
    super(message);
  }
}

export class ConfigurationException extends DomainException {
  readonly code = 'CONFIGURATION_ERROR';
  
  constructor(
    configKey: string,
    message: string = `Configuration error: ${configKey}`,
    cause?: Error
  ) {
    super(message, cause);
  }
}

export class InfrastructureException extends DomainException {
  readonly code = 'INFRASTRUCTURE_ERROR';
  
  constructor(
    component: string,
    message: string = `Infrastructure error in ${component}`,
    cause?: Error
  ) {
    super(message, cause);
  }
}
