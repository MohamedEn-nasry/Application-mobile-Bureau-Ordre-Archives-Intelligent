import { Result } from '../utils/result';

export interface UseCase<Type, Params> {
  execute(params: Params): Promise<Result<Type>>;
}

export class NoParams {}
