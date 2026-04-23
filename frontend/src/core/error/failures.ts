/**
 * Domain failures that represent business logic errors
 * These are not exceptions but expected failure scenarios
 */

export abstract class Failure extends Error {
  abstract readonly type: string;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NetworkFailure extends Failure {
  readonly type = 'NetworkFailure';
  
  constructor(
    public readonly message: string,
    public readonly statusCode?: number,
    public readonly originalError?: Error
  ) {
    super(message);
  }
}

export class ValidationFailure extends Failure {
  readonly type = 'ValidationFailure';
  
  constructor(
    public readonly message: string,
    public readonly field?: string,
    public readonly value?: any
  ) {
    super(message);
  }
}

export class AuthenticationFailure extends Failure {
  readonly type = 'AuthenticationFailure';
  
  constructor(public readonly message: string = 'Authentication failed') {
    super(message);
  }
}

export class AuthorizationFailure extends Failure {
  readonly type = 'AuthorizationFailure';
  
  constructor(public readonly message: string = 'Access denied') {
    super(message);
  }
}

export class NotFoundFailure extends Failure {
  readonly type = 'NotFoundFailure';
  
  constructor(public readonly message: string = 'Resource not found') {
    super(message);
  }
}

export class ConflictFailure extends Failure {
  readonly type = 'ConflictFailure';
  
  constructor(public readonly message: string = 'Resource conflict') {
    super(message);
  }
}

export class BusinessLogicFailure extends Failure {
  readonly type = 'BusinessLogicFailure';
  
  constructor(public readonly message: string, public readonly code?: string) {
    super(message);
  }
}

export class ServerFailure extends Failure {
  readonly type = 'ServerFailure';
  
  constructor(public readonly message: string = 'Server error', public readonly code?: string) {
    super(message);
  }
}

export class UnknownFailure extends Failure {
  readonly type = 'UnknownFailure';
  
  constructor(public readonly message: string = 'Unknown error occurred', public readonly originalError?: Error) {
    super(message);
  }
}

/**
 * Helper function to create appropriate failure from error
 */
export const createFailureFromError = (error: any): Failure => {
  if (error instanceof Failure) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return new NetworkFailure(error.message, undefined, error);
    }
    
    if (error.message.includes('Unauthorized') || error.message.includes('401')) {
      return new AuthenticationFailure(error.message);
    }
    
    if (error.message.includes('Forbidden') || error.message.includes('403')) {
      return new AuthorizationFailure(error.message);
    }
    
    if (error.message.includes('Not Found') || error.message.includes('404')) {
      return new NotFoundFailure(error.message);
    }
    
    if (error.message.includes('Conflict') || error.message.includes('409')) {
      return new ConflictFailure(error.message);
    }
    
    if (error.message.includes('Server') || error.message.includes('500')) {
      return new ServerFailure(error.message);
    }
  }

  return new UnknownFailure('Unknown error occurred', error);
};
