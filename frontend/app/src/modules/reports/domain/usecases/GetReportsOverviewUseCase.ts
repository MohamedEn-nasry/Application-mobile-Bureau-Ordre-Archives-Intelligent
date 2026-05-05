import { Result } from '../../../../core/utils/result';
import { ReportsOverview } from '../entities/ReportsOverview';
import { ReportsRepository } from '../repositories/ReportsRepository';

export class GetReportsOverviewUseCase {
  constructor(private repo: ReportsRepository) {}

  async execute(period: string): Promise<Result<ReportsOverview>> {
    return await this.repo.getOverview(period);
  }
}