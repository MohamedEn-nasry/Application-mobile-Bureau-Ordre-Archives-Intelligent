import { Result } from '../../../../core/utils/result';
import { AgentDashboard } from '../entities/AgentDashboard';

export interface AgentDashboardRepository {
    getOverview(): Promise<Result<AgentDashboard>>;
}