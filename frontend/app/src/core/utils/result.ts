import { Failure } from '../error/failures';

export type Result<T, E = Failure> = Success<T, E> | Error<T, E>;

export class Success<T, E> {
  constructor(public readonly value: T) {}
  isSuccess(): this is Success<T, E> { return true; }
  isError(): this is Error<T, E> { return false; }
}

export class Error<T, E> {
  constructor(public readonly error: E) {}
  isSuccess(): this is Success<T, E> { return false; }
  isError(): this is Error<T, E> { return true; }
}

export const ok = <T, E>(value: T): Result<T, E> => new Success(value);
export const fail = <T, E>(error: E): Result<T, E> => new Error(error);
