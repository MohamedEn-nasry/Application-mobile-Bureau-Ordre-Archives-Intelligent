import { Result } from '../../../../core/utils/result';
import { Courrier } from '../entities/Courrier';
import { AgentOutgoingMailRepository } from '../repositories/AgentOutgoingMailRepository';

export class GetAgentOutgoingMailUseCase {
    constructor(
        private repo: AgentOutgoingMailRepository
    ) { }

    async execute(): Promise<Result<Courrier[]>> {
        return await this.repo.getOutgoingMail();
    }
}