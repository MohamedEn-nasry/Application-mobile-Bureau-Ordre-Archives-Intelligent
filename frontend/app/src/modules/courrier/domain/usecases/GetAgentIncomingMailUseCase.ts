import { Result } from '../../../../core/utils/result';
import { Courrier } from '../entities/Courrier';
import { AgentIncomingMailRepository } from '../repositories/AgentIncomingMailRepository';

export class GetAgentIncomingMailUseCase {
    constructor(
        private repo: AgentIncomingMailRepository
    ) { }

    async execute(): Promise<Result<Courrier[]>> {
        return await this.repo.getIncomingMail();
    }
}