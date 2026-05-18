import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { CourrierResponseModel } from './CourrierRemoteDataSource';

export class AgentOutgoingMailRemoteDataSource {
    async getOutgoingMail(): Promise<CourrierResponseModel[]> {
        return await apiClient.get<CourrierResponseModel[]>(
            endpoints.courriers.agentOutgoing
        );
    }
}