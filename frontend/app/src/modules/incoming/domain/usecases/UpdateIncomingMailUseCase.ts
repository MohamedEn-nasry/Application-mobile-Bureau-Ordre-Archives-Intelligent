import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { IncomingMail } from '../entities/IncomingMail';
import { IncomingMailRepository, UpdateIncomingMailDTO } from '../repositories/IncomingMailRepository';

export class UpdateIncomingMailUseCase implements UseCase<IncomingMail, { id: string; dto: UpdateIncomingMailDTO }> {
  constructor(private repo: IncomingMailRepository) {}

  async execute(params: { id: string; dto: UpdateIncomingMailDTO }): Promise<Result<IncomingMail>> {
    return await this.repo.updateIncomingMail(params.id, params.dto);
  }
}
