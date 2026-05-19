import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { AgentDashboard } from '../entities/AgentDashboard';
import { AgentDashboardRepository } from '../repositories/AgentDashboardRepository';

export class GetAgentDashboardUseCase
    implements UseCase<AgentDashboard, NoParams> {
    constructor(private repo: AgentDashboardRepository) { }

    async execute(): Promise<Result<AgentDashboard>> {
        return await this.repo.getOverview();
    }
}