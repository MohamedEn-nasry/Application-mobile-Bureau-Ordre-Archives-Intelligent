import { success, failure, AsyncResult } from '../../../../core/utils/result';
import { ArchivesRepository, ArchiveFilters, ArchiveListResponse, CreateArchiveParams, UpdateArchiveParams } from '../../domain/repositories/ArchivesRepository';
import { ArchiveItem, ArchiveStatus, ArchiveCategory } from '../../domain/entities/ArchiveItem';
import { ArchivesRemoteDataSource } from '../datasources/ArchivesRemoteDataSource';
import { BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Archives repository implementation
 * Implements the ArchivesRepository interface using remote data source
 */
export class ArchivesRepositoryImpl implements ArchivesRepository {
  constructor(private readonly remoteDataSource: ArchivesRemoteDataSource) {}

  /**
   * Get archive by ID
   */
  async findById(id: string): AsyncResult<ArchiveItem> {
    try {
      const result = await this.remoteDataSource.getArchiveById(id);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get archive by ID', 'GET_ARCHIVE_BY_ID_ERROR')
      );
    }
  }

  /**
   * Get list of archives with optional filters
   */
  async getArchives(filters?: ArchiveFilters): AsyncResult<ArchiveListResponse> {
    try {
      const result = await this.remoteDataSource.getArchives(filters);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get archives', 'GET_ARCHIVES_ERROR')
      );
    }
  }

  /**
   * Create a new archive
   */
  async createArchive(params: CreateArchiveParams): AsyncResult<ArchiveItem> {
    try {
      const result = await this.remoteDataSource.createArchive(params);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to create archive', 'CREATE_ARCHIVE_ERROR')
      );
    }
  }

  /**
   * Update an existing archive
   */
  async updateArchive(id: string, params: UpdateArchiveParams): AsyncResult<ArchiveItem> {
    try {
      const result = await this.remoteDataSource.updateArchive(id, params);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to update archive', 'UPDATE_ARCHIVE_ERROR')
      );
    }
  }

  /**
   * Delete an archive
   */
  async deleteArchive(id: string): AsyncResult<void> {
    try {
      const result = await this.remoteDataSource.deleteArchive(id);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to delete archive', 'DELETE_ARCHIVE_ERROR')
      );
    }
  }

  /**
   * Update archive status
   */
  async updateArchiveStatus(id: string, status: ArchiveStatus): AsyncResult<ArchiveItem> {
    try {
      const result = await this.remoteDataSource.updateArchive(id, { status });
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to update archive status', 'UPDATE_ARCHIVE_STATUS_ERROR')
      );
    }
  }

  /**
   * Search archives by text query
   */
  async searchArchives(query: string, filters?: Partial<ArchiveFilters>): AsyncResult<ArchiveListResponse> {
    try {
      const result = await this.remoteDataSource.searchArchives(query, filters);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to search archives', 'SEARCH_ARCHIVES_ERROR')
      );
    }
  }

  /**
   * Get archives by category
   */
  async getArchivesByCategory(category: ArchiveCategory): AsyncResult<ArchiveItem[]> {
    try {
      const result = await this.remoteDataSource.getArchives({ category });
      
      if (result.isFailure()) {
        return failure(result.error);
      }

      return success(result.value.archives);
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get archives by category', 'GET_ARCHIVES_BY_CATEGORY_ERROR')
      );
    }
  }

  /**
   * Get archives by status
   */
  async getArchivesByStatus(status: ArchiveStatus): AsyncResult<ArchiveItem[]> {
    try {
      const result = await this.remoteDataSource.getArchives({ status });
      
      if (result.isFailure()) {
        return failure(result.error);
      }

      return success(result.value.archives);
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get archives by status', 'GET_ARCHIVES_BY_STATUS_ERROR')
      );
    }
  }

  /**
   * Get archives that are expiring soon
   */
  async getExpiringArchives(days: number): AsyncResult<ArchiveItem[]> {
    try {
      const dateTo = new Date();
      dateTo.setDate(dateTo.getDate() + days);
      
      const result = await this.remoteDataSource.getArchives({
        dateTo,
        sortBy: 'expiryDate',
        sortOrder: 'asc',
      });
      
      if (result.isFailure()) {
        return failure(result.error);
      }

      // Filter archives that are actually expiring within the specified days
      const expiringArchives = result.value.archives.filter(archive => {
        if (!archive.expiryDate) return false;
        const daysUntilExpiry = Math.ceil(
          (archive.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry >= 0 && daysUntilExpiry <= days;
      });

      return success(expiringArchives);
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get expiring archives', 'GET_EXPIRING_ARCHIVES_ERROR')
      );
    }
  }

  /**
   * Get archive statistics
   */
  async getArchiveStats(): AsyncResult<{
    total: number;
    byCategory: Record<ArchiveCategory, number>;
    byStatus: Record<ArchiveStatus, number>;
    totalSize: number;
    expiringSoon: number;
  }> {
    try {
      const result = await this.remoteDataSource.getArchives({ limit: 1000 }); // Get all archives for stats
      
      if (result.isFailure()) {
        return failure(result.error);
      }

      const archives = result.value.archives;
      
      // Calculate statistics
      const stats = {
        total: archives.length,
        byCategory: {} as Record<ArchiveCategory, number>,
        byStatus: {} as Record<ArchiveStatus, number>,
        totalSize: archives.reduce((sum, archive) => sum + archive.size, 0),
        expiringSoon: archives.filter(archive => {
          if (!archive.expiryDate) return false;
          return new Date() > archive.expiryDate || 
            (archive.expiryDate.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000);
        }).length,
      };

      // Initialize category counts
      Object.values(ArchiveCategory).forEach(category => {
        stats.byCategory[category] = 0;
      });

      // Initialize status counts
      Object.values(ArchiveStatus).forEach(status => {
        stats.byStatus[status] = 0;
      });

      // Count by category and status
      archives.forEach(archive => {
        stats.byCategory[archive.category]++;
        stats.byStatus[archive.status]++;
      });

      return success(stats);
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get archive statistics', 'GET_ARCHIVE_STATS_ERROR')
      );
    }
  }

  /**
   * Add tag to archive
   */
  async addTagToArchive(id: string, tag: string): AsyncResult<ArchiveItem> {
    try {
      // First get the current archive
      const getResult = await this.remoteDataSource.getArchiveById(id);
      if (getResult.isFailure()) {
        return getResult;
      }

      const currentArchive = getResult.value;
      
      // Add tag if it doesn't exist
      if (currentArchive.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
        return success(currentArchive);
      }

      // Update archive with new tag
      const updatedTags = [...currentArchive.tags, tag];
      const result = await this.remoteDataSource.updateArchive(id, { tags: updatedTags });
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to add tag to archive', 'ADD_TAG_TO_ARCHIVE_ERROR')
      );
    }
  }

  /**
   * Remove tag from archive
   */
  async removeTagFromArchive(id: string, tag: string): AsyncResult<ArchiveItem> {
    try {
      // First get the current archive
      const getResult = await this.remoteDataSource.getArchiveById(id);
      if (getResult.isFailure()) {
        return getResult;
      }

      const currentArchive = getResult.value;
      
      // Remove tag if it exists
      if (!currentArchive.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
        return success(currentArchive);
      }

      // Update archive without the tag
      const updatedTags = currentArchive.tags.filter(t => t.toLowerCase() !== tag.toLowerCase());
      const result = await this.remoteDataSource.updateArchive(id, { tags: updatedTags });
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to remove tag from archive', 'REMOVE_TAG_FROM_ARCHIVE_ERROR')
      );
    }
  }
}
