import { UseCase } from '../../../../core/base/UseCase';
import { OutgoingCourrier } from '../entities/OutgoingCourrier';
import { IOutgoingCourrierRepository } from '../repositories/IOutgoingCourrierRepository';
import { Result, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';

export interface GetCourrierDetailsParams {
  id: string;
}

export class GetCourrierDetailsUseCase implements UseCase<OutgoingCourrier, GetCourrierDetailsParams> {
  constructor(private readonly repository: IOutgoingCourrierRepository) {}

  async execute(params: GetCourrierDetailsParams): Promise<Result<OutgoingCourrier>> {
    const { id } = params;
    
    if (!id || id.trim() === '') {
      return fail(new ServerFailure('Courrier ID is required', 'INVALID_ID'));
    }

    return this.repository.getCourrierById(id);
  }
}
