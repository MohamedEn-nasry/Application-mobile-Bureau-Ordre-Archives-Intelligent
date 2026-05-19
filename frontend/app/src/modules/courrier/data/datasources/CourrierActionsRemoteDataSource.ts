import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { CourrierHistoryResponseModel } from '../models/CourrierHistoryResponseModel';
import { ReassignCourrierRequestModel } from '../models/ReassignCourrierRequestModel';

export class CourrierActionsRemoteDataSource {
    async reassign(
        courrierId: number,
        payload: ReassignCourrierRequestModel
    ): Promise<boolean> {
        await apiClient.put<any>(
            endpoints.courriers.reassign(courrierId),
            payload
        );

        return true;
    }

    async getHistory(courrierId: number): Promise<CourrierHistoryResponseModel[]> {
        return await apiClient.get<CourrierHistoryResponseModel[]>(
            endpoints.courriers.history(courrierId)
        );
    }
}