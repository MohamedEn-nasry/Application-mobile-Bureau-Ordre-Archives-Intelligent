import { Result } from '../../../../core/utils/result';
import { AgentOutgoingMail } from '../entities/AgentOutgoingMail';
import { AgentOutgoingMailRepository } from '../repositories/AgentOutgoingMailRepository';

export class GetAgentOutgoingMailUseCase {
    constructor(
        private repo: AgentOutgoingMailRepository
    ) { }

    async execute(): Promise<Result<AgentOutgoingMail[]>> {
        return await this.repo.getOutgoingMail();
    }
}