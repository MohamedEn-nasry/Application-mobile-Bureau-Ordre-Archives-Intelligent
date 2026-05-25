import { Result } from '../../../../core/utils/result';
import { AgentOcrResult } from '../entities/AgentOcrResult';
import { SuperAgentDashboardRepository } from '../repositories/SuperAgentDashboardRepository';

export class GetSuperAgentOcrResultsUseCase {
    constructor(private repository: SuperAgentDashboardRepository) { }

    async execute(): Promise<Result<AgentOcrResult[]>> {
        return await this.repository.getOcrResults();
    }
}
