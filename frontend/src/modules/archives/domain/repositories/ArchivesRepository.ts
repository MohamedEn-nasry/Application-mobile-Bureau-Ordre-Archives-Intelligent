import { Result, AsyncResult } from '../../../../core/utils/result';
import { ArchiveItem, ArchiveStatus, ArchiveCategory } from '../entities/ArchiveItem';

/**
 * Archive search filters
 */
export interface ArchiveFilters {
  readonly category?: ArchiveCategory;
  readonly status?: ArchiveStatus;
  readonly query?: string;
  readonly tags?: string[];
  readonly dateFrom?: Date;
  readonly dateTo?: Date;
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: 'title' | 'archivedDate' | 'expiryDate' | 'size';
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated archive list response
 */
export interface ArchiveListResponse {
  readonly archives: ArchiveItem[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

/**
 * Archive creation parameters
 */
export interface CreateArchiveParams {
  readonly title: string;
  readonly description: string;
  readonly category: ArchiveCategory;
  readonly reference: string;
  readonly expiryDate?: Date;
  readonly tags?: string[];
}

/**
 * Archive update parameters
 */
export interface UpdateArchiveParams {
  readonly title?: string;
  readonly description?: string;
  readonly category?: ArchiveCategory;
  readonly status?: ArchiveStatus;
  readonly expiryDate?: Date;
  readonly tags?: string[];
}

/**
 * Archives repository interface
 * Defines the contract for archive management operations
 */
export interface ArchivesRepository {
  /**
   * Get archive by ID
   */
  findById(id: string): AsyncResult<ArchiveItem>;

  /**
   * Get list of archives with optional filters
   */
  getArchives(filters?: ArchiveFilters): AsyncResult<ArchiveListResponse>;

  /**
   * Create a new archive
   */
  createArchive(params: CreateArchiveParams): AsyncResult<ArchiveItem>;

  /**
   * Update an existing archive
   */
  updateArchive(id: string, params: UpdateArchiveParams): AsyncResult<ArchiveItem>;

  /**
   * Delete an archive
   */
  deleteArchive(id: string): AsyncResult<void>;

  /**
   * Update archive status
   */
  updateArchiveStatus(id: string, status: ArchiveStatus): AsyncResult<ArchiveItem>;

  /**
   * Search archives by text query
   */
  searchArchives(query: string, filters?: Partial<ArchiveFilters>): AsyncResult<ArchiveListResponse>;

  /**
   * Get archives by category
   */
  getArchivesByCategory(category: ArchiveCategory): AsyncResult<ArchiveItem[]>;

  /**
   * Get archives by status
   */
  getArchivesByStatus(status: ArchiveStatus): AsyncResult<ArchiveItem[]>;

  /**
   * Get archives that are expiring soon
   */
  getExpiringArchives(days: number): AsyncResult<ArchiveItem[]>;

  /**
   * Get archive statistics
   */
  getArchiveStats(): AsyncResult<{
    total: number;
    byCategory: Record<ArchiveCategory, number>;
    byStatus: Record<ArchiveStatus, number>;
    totalSize: number;
    expiringSoon: number;
  }>;

  /**
   * Add tag to archive
   */
  addTagToArchive(id: string, tag: string): AsyncResult<ArchiveItem>;

  /**
   * Remove tag from archive
   */
  removeTagFromArchive(id: string, tag: string): AsyncResult<ArchiveItem>;
}
