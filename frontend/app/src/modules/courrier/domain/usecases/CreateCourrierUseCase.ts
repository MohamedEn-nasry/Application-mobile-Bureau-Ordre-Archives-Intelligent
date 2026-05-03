import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { Courrier } from '../entities/Courrier';
import {
  CourrierRepository,
  CreateCourrierParams,
} from '../repositories/CourrierRepository';

export class CreateCourrierUseCase implements UseCase<Courrier, CreateCourrierParams> {
  constructor(private repo: CourrierRepository) {}

  async execute(params: CreateCourrierParams): Promise<Result<Courrier>> {
    return await this.repo.createCourrier(params);
  }
}