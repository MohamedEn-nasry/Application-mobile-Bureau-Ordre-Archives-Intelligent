import { apiClient } from '../../../../core/network/apiClient';
import { AgentDashboardResponseModel } from '../models/AgentDashboardResponseModel';
import { endpoints } from '../../../../core/network/endpoints';
import { AgentOcrResultResponseModel } from '../models/AgentOcrResultResponseModel';

export class SuperAgentDashboardRemoteDataSource {
  async getOverview(): Promise<AgentDashboardResponseModel> {
    return await apiClient.get<AgentDashboardResponseModel>(
      endpoints.superAgentDashboard.overview
    );
  }

  async getOcrResults(): Promise<AgentOcrResultResponseModel[]> {
    return await apiClient.get<AgentOcrResultResponseModel[]>(
      endpoints.superAgentDashboard.ocrResults
    );
  }
}
