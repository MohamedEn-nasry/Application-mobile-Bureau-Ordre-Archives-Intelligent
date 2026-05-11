import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { UserEmailLookupResponseModel } from '../models/UserEmailLookupResponseModel';

export class UserLookupRemoteDataSource {
    async searchByEmail(email: string): Promise<UserEmailLookupResponseModel[]> {
        return await apiClient.get<UserEmailLookupResponseModel[]>(
            endpoints.users.searchByEmail(email)
        );
    }
}