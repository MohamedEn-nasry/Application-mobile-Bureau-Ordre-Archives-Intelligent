import { Result } from '../../../../core/utils/result';
import { ReportsOverview } from '../entities/ReportsOverview';

export interface ReportsRepository {
  getOverview(period: string): Promise<Result<ReportsOverview>>;
}