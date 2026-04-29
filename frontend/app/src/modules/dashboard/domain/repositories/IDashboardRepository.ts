import { SummaryStats, ActivityItem, ChartStats } from '../entities/DashboardStats';
import { Result } from '../../../../core/utils/result';

export interface IDashboardRepository {
  getSummaryStats(): Promise<Result<SummaryStats>>;
  getChartStats(): Promise<Result<ChartStats>>;
  getRecentActivity(): Promise<Result<ActivityItem[]>>;
}
