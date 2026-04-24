import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { SummaryStats } from '../entities/DashboardStats';
import { IDashboardRepository } from '../repositories/IDashboardRepository';
import { Result } from '../../../../core/utils/result';

export class GetDashboardStatsUseCase implements UseCase<SummaryStats, NoParams> {
  constructor(private readonly repository: IDashboardRepository) {}

  execute(_params: NoParams): Promise<Result<SummaryStats>> {
    return this.repository.getSummaryStats();
  }
}
