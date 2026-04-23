import { BaseUseCase } from '../../../../core/base/UseCase';
import { success, failure, AsyncResult, Result } from '../../../../core/utils/result';
import { DashboardRepository } from '../repositories/DashboardRepository';
import { DashboardActivity } from '../entities/DashboardStats';
import { ValidationFailure, BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Get recent activities use case input parameters
 */
export interface GetRecentActivitiesParams {
  readonly limit?: number;
}

/**
 * Get recent activities use case
 * Handles retrieving recent activities for dashboard
 */
export class GetRecentActivitiesUseCase extends BaseUseCase<GetRecentActivitiesParams, DashboardActivity[]> {
  constructor(private readonly dashboardRepository: DashboardRepository) {
    super();
  }

  /**
   * Validate input parameters
   */
  protected validateInput(input: GetRecentActivitiesParams): Result<void> {
    // Validate limit if provided
    if (input.limit !== undefined) {
      if (input.limit < 1 || input.limit > 100) {
        return failure(new ValidationFailure('Limit must be between 1 and 100'));
      }
    }

    return success(undefined);
  }

  /**
   * Execute get recent activities use case
   */
  async execute(input: GetRecentActivitiesParams): AsyncResult<DashboardActivity[]> {
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (validation.isFailure()) {
        return failure(validation.error);
      }

      // Get recent activities from repository
      const result = await this.dashboardRepository.getRecentActivities(input.limit);
      
      if (result.isFailure()) {
        return result;
      }

      return success(result.value);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to retrieve recent activities', 'GET_RECENT_ACTIVITIES_ERROR')
      );
    }
  }

  /**
   * Execute with validation (template method)
   */
  async executeWithValidation(input: GetRecentActivitiesParams): AsyncResult<DashboardActivity[]> {
    return super.executeWithValidation(input);
  }
}
