import { Result } from '../../../../core/utils/result';
import { AgentOcrResult } from '../entities/AgentOcrResult';
import { AgentDashboardRepository } from '../repositories/AgentDashboardRepository';

export class GetAgentOcrResultsUseCase {
    constructor(private repository: AgentDashboardRepository) { }

    async execute(): Promise<Result<AgentOcrResult[]>> {
        return await this.repository.getOcrResults();
    }
}