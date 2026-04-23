import { success, failure, AsyncResult } from '../../../../core/utils/result';
import { NetworkFailure, NotFoundFailure } from '../../../../core/error/failures';
import { ApiClient } from '../../../../core/network/apiClient';
import { API_ENDPOINTS } from '../../../../core/network/endpoints';
import { ArchiveFilters, ArchiveListResponse, CreateArchiveParams, UpdateArchiveParams } from '../../domain/repositories/ArchivesRepository';
import { ArchiveItem, ArchiveItemImpl } from '../../domain/entities/ArchiveItem';
import { ArchivesMapper } from '../mappers/ArchivesMapper';
import { ArchiveItemModelImpl } from '../models/ArchiveItemModel';

/**
 * Archive filters interface for API
 */
export interface ArchiveFiltersAPI {
  category?: string;
  status?: string;
  query?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'archivedDate' | 'expiryDate' | 'size';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Archive list response from API
 */
export interface ArchiveListResponseAPI {
  archives: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Archive creation parameters for API
 */
export interface CreateArchiveParamsAPI {
  title: string;
  description: string;
  category: string;
  reference: string;
  expiryDate?: string;
  tags?: string[];
}

/**
 * Archive update parameters for API
 */
export interface UpdateArchiveParamsAPI {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  expiryDate?: string;
  tags?: string[];
}

/**
 * Archives remote data source
 * Handles all remote API calls for archive management
 */
export class ArchivesRemoteDataSource {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly archivesMapper: ArchivesMapper
  ) {}

  /**
   * Get archive by ID
   */
  async getArchiveById(id: string): AsyncResult<ArchiveItem> {
    try {
      const response = await this.apiClient.get(`/archives/${id}`);

      if (response.isFailure()) {
        if (response.error.message.includes('404')) {
          return failure(new NotFoundFailure('Archive not found'));
        }
        return failure(response.error);
      }

      const data = response.value.data;
      const archiveModel = ArchiveItemModelImpl.fromAPI(data);
      const archive = this.archivesMapper.toDomain(archiveModel);

      return success(archive);

    } catch (error) {
      return failure(new NetworkFailure('Get archive failed', undefined, error as Error));
    }
  }

  /**
   * Get list of archives with optional filters
   */
  async getArchives(filters?: ArchiveFilters): AsyncResult<ArchiveListResponse> {
    try {
      const apiFilters = this.mapFiltersToAPI(filters);
      const response = await this.apiClient.get<ArchiveListResponseAPI>('/archives', apiFilters);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const archives = data.archives.map(archiveData => {
        const archiveModel = ArchiveItemModelImpl.fromAPI(archiveData);
        return this.archivesMapper.toDomain(archiveModel);
      });

      return success({
        archives,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });

    } catch (error) {
      return failure(new NetworkFailure('Get archives failed', undefined, error as Error));
    }
  }

  /**
   * Create a new archive
   */
  async createArchive(params: CreateArchiveParams): AsyncResult<ArchiveItem> {
    try {
      const apiParams = this.mapCreateParamsToAPI(params);
      const response = await this.apiClient.post('/archives', apiParams);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const archiveModel = ArchiveItemModelImpl.fromAPI(data);
      const archive = this.archivesMapper.toDomain(archiveModel);

      return success(archive);

    } catch (error) {
      return failure(new NetworkFailure('Create archive failed', undefined, error as Error));
    }
  }

  /**
   * Update an existing archive
   */
  async updateArchive(id: string, params: UpdateArchiveParams): AsyncResult<ArchiveItem> {
    try {
      const apiParams = this.mapUpdateParamsToAPI(params);
      const response = await this.apiClient.put(`/archives/${id}`, apiParams);

      if (response.isFailure()) {
        if (response.error.message.includes('404')) {
          return failure(new NotFoundFailure('Archive not found'));
        }
        return failure(response.error);
      }

      const data = response.value.data;
      const archiveModel = ArchiveItemModelImpl.fromAPI(data);
      const archive = this.archivesMapper.toDomain(archiveModel);

      return success(archive);

    } catch (error) {
      return failure(new NetworkFailure('Update archive failed', undefined, error as Error));
    }
  }

  /**
   * Delete an archive
   */
  async deleteArchive(id: string): AsyncResult<void> {
    try {
      const response = await this.apiClient.delete(`/archives/${id}`);

      if (response.isFailure()) {
        if (response.error.message.includes('404')) {
          return failure(new NotFoundFailure('Archive not found'));
        }
        return failure(response.error);
      }

      return success(undefined);

    } catch (error) {
      return failure(new NetworkFailure('Delete archive failed', undefined, error as Error));
    }
  }

  /**
   * Search archives by text query
   */
  async searchArchives(query: string, filters?: Partial<ArchiveFilters>): AsyncResult<ArchiveListResponse> {
    try {
      const searchFilters = {
        ...this.mapFiltersToAPI(filters),
        query,
      };
      
      const response = await this.apiClient.get<ArchiveListResponseAPI>('/archives/search', searchFilters);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const archives = data.archives.map(archiveData => {
        const archiveModel = ArchiveItemModelImpl.fromAPI(archiveData);
        return this.archivesMapper.toDomain(archiveModel);
      });

      return success({
        archives,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });

    } catch (error) {
      return failure(new NetworkFailure('Search archives failed', undefined, error as Error));
    }
  }

  /**
   * Map filters from domain to API
   */
  private mapFiltersToAPI(filters?: ArchiveFilters): ArchiveFiltersAPI {
    if (!filters) return {};

    return {
      category: filters.category,
      status: filters.status,
      query: filters.query,
      tags: filters.tags,
      dateFrom: filters.dateFrom?.toISOString(),
      dateTo: filters.dateTo?.toISOString(),
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
  }

  /**
   * Map create params from domain to API
   */
  private mapCreateParamsToAPI(params: CreateArchiveParams): CreateArchiveParamsAPI {
    return {
      title: params.title,
      description: params.description,
      category: params.category,
      reference: params.reference,
      expiryDate: params.expiryDate?.toISOString(),
      tags: params.tags,
    };
  }

  /**
   * Map update params from domain to API
   */
  private mapUpdateParamsToAPI(params: UpdateArchiveParams): UpdateArchiveParamsAPI {
    return {
      title: params.title,
      description: params.description,
      category: params.category,
      status: params.status,
      expiryDate: params.expiryDate?.toISOString(),
      tags: params.tags,
    };
  }
}
