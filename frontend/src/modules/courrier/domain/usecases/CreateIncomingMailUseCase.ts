import { BaseUseCase } from '../../../../core/base/UseCase';
import { success, failure, AsyncResult, Result } from '../../../../core/utils/result';
import { CourrierRepository, CreateMailParams } from '../repositories/CourrierRepository';
import { MailItem } from '../entities/MailItem';
import { ValidationFailure, BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Create incoming mail use case input parameters
 */
export interface CreateIncomingMailParams {
  readonly subject: string;
  readonly description: string;
  readonly sender: string;
  readonly category: string;
  readonly priority?: string;
  readonly attachments?: File[];
  readonly tags?: string[];
  readonly assignedTo?: string;
}

/**
 * Create incoming mail use case
 * Handles creating new incoming mail
 */
export class CreateIncomingMailUseCase extends BaseUseCase<CreateIncomingMailParams, MailItem> {
  constructor(private readonly courrierRepository: CourrierRepository) {
    super();
  }

  /**
   * Validate input parameters
   */
  protected validateInput(input: CreateIncomingMailParams): Result<void> {
    const errors: string[] = [];

    if (!input.subject || input.subject.trim().length === 0) {
      errors.push('Subject is required');
    }

    if (!input.description || input.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!input.sender || input.sender.trim().length === 0) {
      errors.push('Sender is required');
    }

    if (!input.category || input.category.trim().length === 0) {
      errors.push('Category is required');
    }

    if (input.attachments && input.attachments.length > 10) {
      errors.push('Maximum 10 attachments allowed');
    }

    if (input.tags && input.tags.length > 20) {
      errors.push('Maximum 20 tags allowed');
    }

    if (errors.length > 0) {
      return failure(new ValidationFailure('Validation failed', undefined, errors));
    }

    return success(undefined);
  }

  /**
   * Execute create incoming mail use case
   */
  async execute(input: CreateIncomingMailParams): AsyncResult<MailItem> {
    try {
      // Validate input
      const validation = this.validateInput(input);
      if (validation.isFailure()) {
        return failure(validation.error);
      }

      // Create mail params for repository
      const createParams: CreateMailParams = {
        type: 'incoming' as any,
        subject: input.subject.trim(),
        description: input.description.trim(),
        sender: input.sender.trim(),
        category: input.category.trim(),
        priority: input.priority,
        attachments: input.attachments,
        tags: input.tags?.map(tag => tag.trim()),
        assignedTo: input.assignedTo?.trim(),
      };

      // Create incoming mail
      const result = await this.courrierRepository.createIncomingMail(createParams);
      
      if (result.isFailure()) {
        return result;
      }

      return success(result.value);

    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to create incoming mail', 'CREATE_INCOMING_MAIL_ERROR')
      );
    }
  }

  /**
   * Execute with validation (template method)
   */
  async executeWithValidation(input: CreateIncomingMailParams): AsyncResult<MailItem> {
    return super.executeWithValidation(input);
  }
}
