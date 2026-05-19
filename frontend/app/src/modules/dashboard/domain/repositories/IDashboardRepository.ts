import { SummaryStats, ActivityItem } from '../entities/DashboardStats';
import { Result } from '../../../../core/utils/result';

export interface IDashboardRepository {
  getSummaryStats(): Promise<Result<SummaryStats>>;
  getRecentActivity(): Promise<Result<ActivityItem[]>>;
}
