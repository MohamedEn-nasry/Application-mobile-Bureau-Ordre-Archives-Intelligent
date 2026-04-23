import { BaseUseCase } from '../../../../core/base/UseCase';
import { success, failure, AsyncResult, Result } from '../../../../core/utils/result';
import { DashboardRepository } from '../repositories/DashboardRepository';
import { DashboardStats } from '../entities/DashboardStats';
import { BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Get dashboard stats use case input parameters
 */
export interface GetDashboardStatsParams {
  readonly refresh?: boolean;
}

/**
 * Get dashboard stats use case
 * Handles retrieving comprehensive dashboard statistics
 */
export class GetDashboardStatsUseCase extends BaseUseCase<GetDashboardStatsParams, DashboardStats> {
  constructor(private readonly dashboardRepository: DashboardRepository) {
    super();
  }

  /**
   * Validate input parameters
   */
  protected validateInput(input: GetDashboardStatsParams): Result<void> {
    // No validation required for this use case
    return success(undefined);
  }

  /**
   * Execute get dashboard stats use case
   */
  async execute(input: GetDashboardStatsParams): AsyncResult<DashboardStats> {
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (validation.isFailure()) {
        return failure(validation.error);
      }

      // Get dashboard stats from repository
      const result = await this.dashboardRepository.getDashboardStats();
      
      if (result.isFailure()) {
        return result;
      }

      return success(result.value);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to retrieve dashboard statistics', 'GET_DASHBOARD_STATS_ERROR')
      );
    }
  }

  /**
   * Execute with validation (template method)
   */
  async executeWithValidation(input: GetDashboardStatsParams): AsyncResult<DashboardStats> {
    return super.executeWithValidation(input);
  }
}
