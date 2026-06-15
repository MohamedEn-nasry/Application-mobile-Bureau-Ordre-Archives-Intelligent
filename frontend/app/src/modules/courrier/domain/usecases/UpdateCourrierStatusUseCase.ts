import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { CourrierRepository } from '../repositories/CourrierRepository';

export interface UpdateCourrierStatusParams {
  id: number;
  statut: string;
}

export class UpdateCourrierStatusUseCase
  implements UseCase<boolean, UpdateCourrierStatusParams>
{
  constructor(private repo: CourrierRepository) {}

  async execute(params: UpdateCourrierStatusParams): Promise<Result<boolean>> {
    return await this.repo.updateCourrierStatus(params.id, params.statut);
  }
}