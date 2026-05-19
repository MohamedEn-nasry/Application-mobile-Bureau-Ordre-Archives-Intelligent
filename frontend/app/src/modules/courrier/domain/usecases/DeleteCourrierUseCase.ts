import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { CourrierRepository } from '../repositories/CourrierRepository';

export class DeleteCourrierUseCase implements UseCase<boolean, number> {
  constructor(private repo: CourrierRepository) {}

  async execute(id: number): Promise<Result<boolean>> {
    return await this.repo.deleteCourrier(id);
  }
}