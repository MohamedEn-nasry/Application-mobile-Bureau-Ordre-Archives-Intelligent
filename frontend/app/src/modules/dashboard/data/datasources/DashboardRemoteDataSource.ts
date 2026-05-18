import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { SummaryStats, ActivityItem, ActivityIconType, ChartStats } from '../../domain/entities/DashboardStats';

export interface IDashboardRemoteDataSource {
    getSummaryStats(days?: number): Promise<SummaryStats>;
    getChartStats(days?: number): Promise<ChartStats>;
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
    async getSummaryStats(days?: number): Promise<SummaryStats> {
        const query = days ? `?days=${days}` : '';
        const response = await apiClient.get<SummaryStats>(`${endpoints.dashboard.stats}${query}`);
        return response;
    }

    async getChartStats(days?: number): Promise<ChartStats> {
        const query = days ? `?days=${days}` : '';
        const response = await apiClient.get<ChartStats>(`${endpoints.dashboard.charts}${query}`);
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