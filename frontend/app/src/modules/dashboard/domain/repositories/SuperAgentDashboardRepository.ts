import { Result } from '../../../../core/utils/result';
import { AgentDashboard } from '../entities/AgentDashboard';
import { AgentOcrResult } from '../entities/AgentOcrResult';

export interface SuperAgentDashboardRepository {
    getOverview(): Promise<Result<AgentDashboard>>;
    getOcrResults(): Promise<Result<AgentOcrResult[]>>;
}
