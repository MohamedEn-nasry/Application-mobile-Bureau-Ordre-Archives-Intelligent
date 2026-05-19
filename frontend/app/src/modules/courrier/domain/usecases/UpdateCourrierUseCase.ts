import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import {
  CourrierRepository,
  UpdateCourrierParams,
} from '../repositories/CourrierRepository';

export class UpdateCourrierUseCase implements UseCase<boolean, UpdateCourrierParams> {
  constructor(private repo: CourrierRepository) {}

  async execute(params: UpdateCourrierParams): Promise<Result<boolean>> {
    return await this.repo.updateCourrier(params);
  }
}