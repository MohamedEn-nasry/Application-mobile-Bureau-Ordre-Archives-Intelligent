import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { SummaryStats, ActivityItem, ActivityIconType } from '../../domain/entities/DashboardStats';

export interface IDashboardRemoteDataSource {
    getSummaryStats(): Promise<SummaryStats>;
    getRecentActivity(): Promise<ActivityItem[]>;
}

interface ActivityResponseDto {
    id: string;
    user: string;
    action: string;
    time: string;
    icon: string;
}

export class DashboardRemoteDataSource implements IDashboardRemoteDataSource {
    async getSummaryStats(): Promise<SummaryStats> {
        const response = await apiClient.get<SummaryStats>(endpoints.dashboard.stats);
        return response;
    }

    async getRecentActivity(): Promise<ActivityItem[]> {
        const response = await apiClient.get<ActivityResponseDto[]>(endpoints.dashboard.activity);

        return response.map(item => new ActivityItem(
            item.id,
            item.user,
            item.action,
            item.time,
            item.icon ? (item.icon as ActivityIconType) : 'eye'
        ));
    }
}