import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { UserProfileResponseModel } from '../models/UserProfileResponseModel';

export class UserProfileRemoteDataSource {
    async getById(id: number): Promise<UserProfileResponseModel> {
        const data = await apiClient.get<UserProfileResponseModel>(
            endpoints.users.details(id)
        );

        return data;
    }
}