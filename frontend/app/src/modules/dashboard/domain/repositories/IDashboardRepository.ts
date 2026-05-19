import { SummaryStats, ActivityItem, ChartStats } from '../entities/DashboardStats';
import { Result } from '../../../../core/utils/result';

export interface IDashboardRepository {
  getSummaryStats(days?: number): Promise<Result<SummaryStats>>;
  getChartStats(days?: number): Promise<Result<ChartStats>>;
  getRecentActivity(): Promise<Result<ActivityItem[]>>;
}
