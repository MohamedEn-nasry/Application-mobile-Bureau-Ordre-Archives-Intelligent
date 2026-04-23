import { BaseUseCase } from '../../../../core/base/UseCase';
import { success, failure, AsyncResult, Result } from '../../../../core/utils/result';
import { CourrierRepository } from '../repositories/CourrierRepository';
import { MailItem } from '../entities/MailItem';
import { MailStatus } from '../entities/MailItem';
import { ValidationFailure, BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Update mail status use case input parameters
 */
export interface UpdateMailStatusParams {
  readonly id: string;
  readonly status: MailStatus;
}

/**
 * Update mail status use case
 * Handles updating mail status
 */
export class UpdateMailStatusUseCase extends BaseUseCase<UpdateMailStatusParams, MailItem> {
  constructor(private readonly courrierRepository: CourrierRepository) {
    super();
  }

  /**
   * Validate input parameters
   */
  protected validateInput(input: UpdateMailStatusParams): Result<void> {
    const errors: string[] = [];

    if (!input.id || input.id.trim().length === 0) {
      errors.push('Mail ID is required');
    }

    if (!input.status) {
      errors.push('Status is required');
    }

    if (errors.length > 0) {
      return failure(new ValidationFailure('Validation failed', undefined, errors));
    }

    return success(undefined);
  }

  /**
   * Execute update mail status use case
   */
  async execute(input: UpdateMailStatusParams): AsyncResult<MailItem> {
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (validation.isFailure()) {
        return failure(validation.error);
      }

      // Update mail status
      const result = await this.courrierRepository.updateMailStatus(input.id.trim(), input.status);
      
      if (result.isFailure()) {
        return result;
      }

      return success(result.value);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to update mail status', 'UPDATE_MAIL_STATUS_ERROR')
      );
    }
  }

  /**
   * Execute with validation (template method)
   */
  async executeWithValidation(input: UpdateMailStatusParams): AsyncResult<MailItem> {
    return super.executeWithValidation(input);
  }
}
