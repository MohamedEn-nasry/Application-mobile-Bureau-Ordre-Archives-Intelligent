import { UseCase } from '@core/base/UseCase';
import { Result, ok, fail } from '@core/utils/result';
import { ArchivesRepository, ArchiveFilters, ArchiveListResponse } from '@modules/archives/domain/repositories/ArchivesRepository';
import { ValidationFailure, BusinessLogicFailure } from '@core/error/failures';

/**
 * Get archives use case input parameters
 */
export interface GetArchivesParams {
  readonly filters?: ArchiveFilters;
}

/**
 * Get archives use case
 * Handles retrieving archives with optional filters
 */
export class GetArchivesUseCase implements UseCase<ArchiveListResponse, GetArchivesParams> {
  constructor(private readonly archivesRepository: ArchivesRepository) {
  }

  /**
   * Validate input parameters
   */
  protected validateInput(input: GetArchivesParams): Result<void> {
    // Validate filters if provided
    if (input.filters) {
      const { page, limit } = input.filters;
      
      if (page !== undefined && (page < 1 || !Number.isInteger(page))) {
        return fail(new ValidationFailure('Page must be a positive integer'));
      }
      
      if (limit !== undefined && (limit < 1 || limit > 100 || !Number.isInteger(limit))) {
        return fail(new ValidationFailure('Limit must be between 1 and 100'));
      }
    }

    return ok(undefined);
  }

  /**
   * Execute get archives use case
   */
  async execute(params: GetArchivesParams): Promise<Result<ArchiveListResponse>> {
    try {
      // Validate input
      const validation = this.validateInput(params);
      if (validation.isError()) {
        return fail(validation.error);
      }

      // Get archives from repository
      const result = await this.archivesRepository.getArchives(params.filters);
      
      if (result.isError()) {
        return result;
      }

      return ok(result.value);

    } catch (error) {
      return fail(
        new BusinessLogicFailure('Failed to retrieve archives', 'GET_ARCHIVES_ERROR')
      );
    }
  }

}
