import { BaseUseCase } from '../../../../core/base/UseCase';
import { success, failure, AsyncResult, Result } from '../../../../core/utils/result';
import { CourrierRepository } from '../repositories/CourrierRepository';
import { MailItem } from '../entities/MailItem';
import { ValidationFailure, BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Get mail detail use case input parameters
 */
export interface GetMailDetailParams {
  readonly id: string;
}

/**
 * Get mail detail use case
 * Handles retrieving detailed mail information
 */
export class GetMailDetailUseCase extends BaseUseCase<GetMailDetailParams, MailItem> {
  constructor(private readonly courrierRepository: CourrierRepository) {
    super();
  }

  /**
   * Validate input parameters
   */
  protected validateInput(input: GetMailDetailParams): Result<void> {
    if (!input.id || input.id.trim().length === 0) {
      return failure(new ValidationFailure('Mail ID is required'));
    }
    return success(undefined);
  }

  /**
   * Execute get mail detail use case
   */
  async execute(input: GetMailDetailParams): AsyncResult<MailItem> {
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (validation.isFailure()) {
        return failure(validation.error);
      }

      // Get mail detail from repository
      const result = await this.courrierRepository.getMailDetail(input.id.trim());
      
      if (result.isFailure()) {
        return result;
      }

      return success(result.value);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to retrieve mail detail', 'GET_MAIL_DETAIL_ERROR')
      );
    }
  }

  /**
   * Execute with validation (template method)
   */
  async executeWithValidation(input: GetMailDetailParams): AsyncResult<MailItem> {
    return super.executeWithValidation(input);
  }
}
