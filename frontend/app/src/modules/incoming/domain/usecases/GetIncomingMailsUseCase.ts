import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { IncomingMail } from '../entities/IncomingMail';
import { IncomingMailRepository, IncomingMailFilter } from '../repositories/IncomingMailRepository';

export class GetIncomingMailsUseCase implements UseCase<IncomingMail[], IncomingMailFilter> {
  constructor(private repo: IncomingMailRepository) {}

  async execute(params: IncomingMailFilter): Promise<Result<IncomingMail[]>> {
    return await this.repo.getIncomingMails(params);
  }
}
