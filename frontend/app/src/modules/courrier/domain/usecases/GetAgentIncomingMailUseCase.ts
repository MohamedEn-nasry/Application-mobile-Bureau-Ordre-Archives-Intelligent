import { Result } from '../../../../core/utils/result';
import { AgentIncomingMail } from '../entities/AgentIncomingMail';
import { AgentIncomingMailRepository } from '../repositories/AgentIncomingMailRepository';

export class GetAgentIncomingMailUseCase {
    constructor(
        private repo: AgentIncomingMailRepository
    ) { }

    async execute(): Promise<Result<AgentIncomingMail[]>> {
        return await this.repo.getIncomingMail();
    }
}