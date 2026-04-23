import { BaseUseCase } from '../../../../core/base/UseCase';
import { success, failure, AsyncResult, Result } from '../../../../core/utils/result';
import { CourrierRepository, MailListResponse } from '../repositories/CourrierRepository';
import { MailFilters } from '../entities/MailFilters';
import { ValidationFailure, BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Get incoming mail use case input parameters
 */
export interface GetIncomingMailParams {
  readonly filters?: Partial<MailFilters>;
}

/**
 * Get incoming mail use case
 * Handles retrieving incoming mails with optional filters
 */
export class GetIncomingMailUseCase extends BaseUseCase<GetIncomingMailParams, MailListResponse> {
  constructor(private readonly courrierRepository: CourrierRepository) {
    super();
  }

  /**
   * Validate input parameters
   */
  protected validateInput(input: GetIncomingMailParams): Result<void> {
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
   * Execute get incoming mail use case
   */
  async execute(input: GetIncomingMailParams): AsyncResult<MailListResponse> {
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (validation.isFailure()) {
        return failure(validation.error);
      }

      // Get incoming mails from repository
      const result = await this.courrierRepository.getIncomingMails(input.filters);
      
      if (result.isFailure()) {
        return result;
      }

      return success(result.value);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to retrieve incoming mails', 'GET_INCOMING_MAIL_ERROR')
      );
    }
  }

  /**
   * Execute with validation (template method)
   */
  async executeWithValidation(input: GetIncomingMailParams): AsyncResult<MailListResponse> {
    return super.executeWithValidation(input);
  }
}
