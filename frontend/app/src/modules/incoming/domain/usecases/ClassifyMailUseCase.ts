import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { IncomingMail } from '../entities/IncomingMail';
import { IncomingMailRepository } from '../repositories/IncomingMailRepository';

export class ClassifyMailUseCase implements UseCase<IncomingMail, string> {
  constructor(private repo: IncomingMailRepository) {}

  async execute(mailId: string): Promise<Result<IncomingMail>> {
    return await this.repo.classifyMail(mailId);
  }
}
