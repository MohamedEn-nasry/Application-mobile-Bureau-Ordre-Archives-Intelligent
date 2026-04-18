export abstract class Failure {
  constructor(public readonly message: string, public readonly code?: string) {}
}

export class ServerFailure extends Failure {}
export class NetworkFailure extends Failure {}
export class CacheFailure extends Failure {}
export class AuthFailure extends Failure {}
export class UnknownFailure extends Failure {}
