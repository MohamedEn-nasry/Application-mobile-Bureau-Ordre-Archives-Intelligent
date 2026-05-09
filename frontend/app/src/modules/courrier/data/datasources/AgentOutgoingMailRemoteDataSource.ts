import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { AgentOutgoingMailResponseModel } from '../models/AgentOutgoingMailResponseModel';

export class AgentOutgoingMailRemoteDataSource {
    async getOutgoingMail(): Promise<AgentOutgoingMailResponseModel[]> {
        return await apiClient.get<AgentOutgoingMailResponseModel[]>(
            endpoints.courriers.agentOutgoing
        );
    }
}