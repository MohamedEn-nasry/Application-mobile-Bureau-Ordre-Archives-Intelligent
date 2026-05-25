import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { AgentDashboard } from '../entities/AgentDashboard';
import { SuperAgentDashboardRepository } from '../repositories/SuperAgentDashboardRepository';

export class GetSuperAgentDashboardUseCase
    implements UseCase<AgentDashboard, NoParams> {
    constructor(private repo: SuperAgentDashboardRepository) { }

    async execute(): Promise<Result<AgentDashboard>> {
        return await this.repo.getOverview();
    }
}
