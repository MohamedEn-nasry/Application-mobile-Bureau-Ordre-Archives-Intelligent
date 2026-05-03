import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { Courrier } from '../entities/Courrier';
import { CourrierRepository } from '../repositories/CourrierRepository';

export class GetCourriersUseCase implements UseCase<Courrier[], NoParams> {
  constructor(private repo: CourrierRepository) {}

  async execute(): Promise<Result<Courrier[]>> {
    return await this.repo.getCourriers();
  }
}