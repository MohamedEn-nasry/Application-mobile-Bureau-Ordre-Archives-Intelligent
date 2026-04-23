import { BaseUseCase } from '../../../../core/base/UseCase';
import { success, failure, AsyncResult, Result } from '../../../../core/utils/result';
import { CourrierRepository, MailListResponse } from '../repositories/CourrierRepository';
import { MailFilters } from '../entities/MailFilters';
import { ValidationFailure, BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Get mail history use case input parameters
 */
export interface GetMailHistoryParams {
  readonly filters?: Partial<MailFilters>;
}

/**
 * Get mail history use case
 * Handles retrieving mail history with optional filters
 */
export class GetMailHistoryUseCase extends BaseUseCase<GetMailHistoryParams, MailListResponse> {
  constructor(private readonly courrierRepository: CourrierRepository) {
    super();
  }

  /**
   * Validate input parameters
   */
  protected validateInput(input: GetMailHistoryParams): Result<void> {
    // Validate filters if provided
    if (input.filters) {
      const { page, limit } = input.filters;
      
      if (page !== undefined && (page < 1 || !Number.isInteger(page))) {
        return failure(new ValidationFailure('Page must be a positive integer'));
      }
      
      if (limit !== undefined && (limit < 1 || limit > 100 || !Number.isInteger(limit))) {
        return failure(new ValidationFailure('Limit must be between 1 and 100'));
      }
    }

    return success(undefined);
  }

  /**
   * Execute get mail history use case
   */
  async execute(input: GetMailHistoryParams): AsyncResult<MailListResponse> {
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (validation.isFailure()) {
        return failure(validation.error);
      }

      // Get mail history from repository
      const result = await this.courrierRepository.getMailHistory(input.filters);
      
      if (result.isFailure()) {
        return result;
      }

      return success(result.value);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to retrieve mail history', 'GET_MAIL_HISTORY_ERROR')
      );
    }
  }

  /**
   * Execute with validation (template method)
   */
  async executeWithValidation(input: GetMailHistoryParams): AsyncResult<MailListResponse> {
    return super.executeWithValidation(input);
  }
}
