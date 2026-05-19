import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { ActivityItem } from '../entities/DashboardStats';
import { IDashboardRepository } from '../repositories/IDashboardRepository';
import { Result } from '../../../../core/utils/result';

export class GetRecentActivityUseCase implements UseCase<ActivityItem[], NoParams> {
  constructor(private readonly repository: IDashboardRepository) {}

  execute(_params: NoParams): Promise<Result<ActivityItem[]>> {
    return this.repository.getRecentActivity();
  }
}
