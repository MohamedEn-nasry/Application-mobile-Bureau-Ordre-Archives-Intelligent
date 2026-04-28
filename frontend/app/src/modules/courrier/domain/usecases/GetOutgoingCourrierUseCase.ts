import { UseCase } from '../../../../core/base/UseCase';
import { OutgoingCourrier } from '../entities/OutgoingCourrier';
import { CourrierFilter } from '../entities/CourrierFilter';
import { IOutgoingCourrierRepository } from '../repositories/IOutgoingCourrierRepository';
import { Result } from '../../../../core/utils/result';

export interface GetOutgoingCourrierParams {
  filter?: CourrierFilter;
}

export class GetOutgoingCourrierUseCase implements UseCase<OutgoingCourrier[], GetOutgoingCourrierParams> {
  constructor(private readonly repository: IOutgoingCourrierRepository) {}

  async execute(params: GetOutgoingCourrierParams): Promise<Result<OutgoingCourrier[]>> {
    const { filter } = params;
    
    // Set default pagination if not provided
    const finalFilter = filter ? {
      ...filter,
      page: filter.page || 1,
      limit: filter.limit || 20,
      sortBy: filter.sortBy || 'dateSent',
      sortOrder: filter.sortOrder || 'desc'
    } : {
      page: 1,
      limit: 20,
      sortBy: 'dateSent' as const,
      sortOrder: 'desc' as const
    };

    return this.repository.getOutgoingCourrier(finalFilter);
  }
}
