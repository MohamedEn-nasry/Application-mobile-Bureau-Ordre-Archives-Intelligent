import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { LecteurDashboardResponseModel } from '../models/LecteurDashboardResponseModel';

export class LecteurDashboardRemoteDataSource {
    async getOverview(): Promise<LecteurDashboardResponseModel> {
        return await apiClient.get<LecteurDashboardResponseModel>(
            endpoints.lecteurDashboard.overview
        );
    }
}