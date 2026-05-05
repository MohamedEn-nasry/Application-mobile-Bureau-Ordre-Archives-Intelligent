import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { ReportsOverview } from '../../domain/entities/ReportsOverview';

export class ReportsRemoteDataSource {
  async getOverview(period: string): Promise<ReportsOverview> {
    return await apiClient.get<ReportsOverview>(
      endpoints.reports.overview(period)
    );
  }
}