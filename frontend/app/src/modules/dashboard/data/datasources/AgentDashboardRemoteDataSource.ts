import { apiClient } from '../../../../core/network/apiClient';
import { AgentDashboardResponseModel } from '../models/AgentDashboardResponseModel';
import { endpoints } from '../../../../core/network/endpoints';
export class AgentDashboardRemoteDataSource {
    async getOverview(): Promise<AgentDashboardResponseModel> {
        return await apiClient.get<AgentDashboardResponseModel>(
            endpoints.agentDashboard.overview
        );
    }
}