import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { AgentIncomingMailResponseModel } from '../models/AgentIncomingMailResponseModel';

export class AgentIncomingMailRemoteDataSource {
    async getIncomingMail(): Promise<AgentIncomingMailResponseModel[]> {
        return await apiClient.get<AgentIncomingMailResponseModel[]>(
            endpoints.courriers.agentIncoming
        );
    }
}