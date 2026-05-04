import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { IncomingMail } from '../entities/IncomingMail';
import { IncomingMailRepository, CreateIncomingMailDTO } from '../repositories/IncomingMailRepository';

export class CreateIncomingMailUseCase implements UseCase<IncomingMail, CreateIncomingMailDTO> {
  constructor(private repo: IncomingMailRepository) {}

  async execute(dto: CreateIncomingMailDTO): Promise<Result<IncomingMail>> {
    return await this.repo.createIncomingMail(dto);
  }
}
