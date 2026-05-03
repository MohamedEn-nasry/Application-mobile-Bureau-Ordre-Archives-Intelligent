import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { Courrier } from '../entities/Courrier';
import { CourrierRepository } from '../repositories/CourrierRepository';

export class GetCourrierByIdUseCase implements UseCase<Courrier, number> {
  constructor(private repo: CourrierRepository) {}

  async execute(id: number): Promise<Result<Courrier>> {
    return await this.repo.getCourrierById(id);
  }
}