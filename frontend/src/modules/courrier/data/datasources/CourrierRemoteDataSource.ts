import { success, failure, AsyncResult } from '../../../../core/utils/result';
import { NetworkFailure, NotFoundFailure } from '../../../../core/error/failures';
import { ApiClient } from '../../../../core/network/apiClient';
import { MailListResponse, CreateMailParams, UpdateMailParams } from '../../domain/repositories/CourrierRepository';
import { MailFilters } from '../../domain/entities/MailFilters';
import { MailItem, MailStatus } from '../../domain/entities/MailItem';
import { CourrierMapper } from '../mappers/CourrierMapper';
import { MailItemModelImpl } from '../models/MailItemModel';

/**
 * Mail filters interface for API
 */
export interface MailFiltersAPI {
  type?: string;
  status?: string;
  priority?: string;
  category?: string;
  query?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
  hasAttachments?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'subject' | 'sender' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Mail list response from API
 */
export interface MailListResponseAPI {
  mails: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Mail creation parameters for API
 */
export interface CreateMailParamsAPI {
  type: string;
  subject: string;
  description: string;
  sender?: string;
  recipient?: string;
  category: string;
  priority?: string;
  attachments?: File[];
  tags?: string[];
  assignedTo?: string;
}

/**
 * Mail update parameters for API
 */
export interface UpdateMailParamsAPI {
  subject?: string;
  description?: string;
  status?: string;
  category?: string;
  priority?: string;
  assignedTo?: string;
  tags?: string[];
}

/**
 * Courrier remote data source
 * Handles all remote API calls for mail management
 */
export class CourrierRemoteDataSource {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly courrierMapper: CourrierMapper
  ) {}

  /**
   * Get mail by ID
   */
  async getMailById(id: string): AsyncResult<MailItem> {
    try {
      const response = await this.apiClient.get(`/courrier/${id}`);

      if (response.isFailure()) {
        if (response.error.message.includes('404')) {
          return failure(new NotFoundFailure('Mail not found'));
        }
        return failure(response.error);
      }

      const data = response.value.data;
      const mailModel = MailItemModelImpl.fromAPI(data);
      const mail = this.courrierMapper.toDomain(mailModel);

      return success(mail);

    } catch (error) {
      return failure(new NetworkFailure('Get mail failed', undefined, error as Error));
    }
  }

  /**
   * Get list of mails with optional filters
   */
  async getMails(filters?: MailFilters): AsyncResult<MailListResponse> {
    try {
      const apiFilters = this.mapFiltersToAPI(filters);
      const response = await this.apiClient.get<MailListResponseAPI>('/courrier', apiFilters);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const mails = data.mails.map(mailData => {
        const mailModel = MailItemModelImpl.fromAPI(mailData);
        return this.courrierMapper.toDomain(mailModel);
      });

      return success({
        mails,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });

    } catch (error) {
      return failure(new NetworkFailure('Get mails failed', undefined, error as Error));
    }
  }

  /**
   * Get incoming mails
   */
  async getIncomingMails(filters?: Partial<MailFilters>): AsyncResult<MailListResponse> {
    try {
      const apiFilters = {
        ...this.mapFiltersToAPI(filters),
        type: 'incoming',
      };
      
      const response = await this.apiClient.get<MailListResponseAPI>('/courrier', apiFilters);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const mails = data.mails.map(mailData => {
        const mailModel = MailItemModelImpl.fromAPI(mailData);
        return this.courrierMapper.toDomain(mailModel);
      });

      return success({
        mails,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });

    } catch (error) {
      return failure(new NetworkFailure('Get incoming mails failed', undefined, error as Error));
    }
  }

  /**
   * Get outgoing mails
   */
  async getOutgoingMails(filters?: Partial<MailFilters>): AsyncResult<MailListResponse> {
    try {
      const apiFilters = {
        ...this.mapFiltersToAPI(filters),
        type: 'outgoing',
      };
      
      const response = await this.apiClient.get<MailListResponseAPI>('/courrier', apiFilters);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const mails = data.mails.map(mailData => {
        const mailModel = MailItemModelImpl.fromAPI(mailData);
        return this.courrierMapper.toDomain(mailModel);
      });

      return success({
        mails,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });

    } catch (error) {
      return failure(new NetworkFailure('Get outgoing mails failed', undefined, error as Error));
    }
  }

  /**
   * Create a new mail
   */
  async createMail(params: CreateMailParams): AsyncResult<MailItem> {
    try {
      const apiParams = this.mapCreateParamsToAPI(params);
      const response = await this.apiClient.post('/courrier', apiParams);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const mailModel = MailItemModelImpl.fromAPI(data);
      const mail = this.courrierMapper.toDomain(mailModel);

      return success(mail);

    } catch (error) {
      return failure(new NetworkFailure('Create mail failed', undefined, error as Error));
    }
  }

  /**
   * Create incoming mail
   */
  async createIncomingMail(params: Omit<CreateMailParams, 'type'>): AsyncResult<MailItem> {
    try {
      const apiParams = {
        ...this.mapCreateParamsToAPI(params as CreateMailParams),
        type: 'incoming',
      };
      
      const response = await this.apiClient.post('/courrier', apiParams);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const mailModel = MailItemModelImpl.fromAPI(data);
      const mail = this.courrierMapper.toDomain(mailModel);

      return success(mail);

    } catch (error) {
      return failure(new NetworkFailure('Create incoming mail failed', undefined, error as Error));
    }
  }

  /**
   * Create outgoing mail
   */
  async createOutgoingMail(params: Omit<CreateMailParams, 'type'>): AsyncResult<MailItem> {
    try {
      const apiParams = {
        ...this.mapCreateParamsToAPI(params as CreateMailParams),
        type: 'outgoing',
      };
      
      const response = await this.apiClient.post('/courrier', apiParams);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const mailModel = MailItemModelImpl.fromAPI(data);
      const mail = this.courrierMapper.toDomain(mailModel);

      return success(mail);

    } catch (error) {
      return failure(new NetworkFailure('Create outgoing mail failed', undefined, error as Error));
    }
  }

  /**
   * Update an existing mail
   */
  async updateMail(id: string, params: UpdateMailParams): AsyncResult<MailItem> {
    try {
      const apiParams = this.mapUpdateParamsToAPI(params);
      const response = await this.apiClient.put(`/courrier/${id}`, apiParams);

      if (response.isFailure()) {
        if (response.error.message.includes('404')) {
          return failure(new NotFoundFailure('Mail not found'));
        }
        return failure(response.error);
      }

      const data = response.value.data;
      const mailModel = MailItemModelImpl.fromAPI(data);
      const mail = this.courrierMapper.toDomain(mailModel);

      return success(mail);

    } catch (error) {
      return failure(new NetworkFailure('Update mail failed', undefined, error as Error));
    }
  }

  /**
   * Update mail status
   */
  async updateMailStatus(id: string, status: MailStatus): AsyncResult<MailItem> {
    try {
      const response = await this.apiClient.put(`/courrier/${id}/status`, { status });

      if (response.isFailure()) {
        if (response.error.message.includes('404')) {
          return failure(new NotFoundFailure('Mail not found'));
        }
        return failure(response.error);
      }

      const data = response.value.data;
      const mailModel = MailItemModelImpl.fromAPI(data);
      const mail = this.courrierMapper.toDomain(mailModel);

      return success(mail);

    } catch (error) {
      return failure(new NetworkFailure('Update mail status failed', undefined, error as Error));
    }
  }

  /**
   * Delete a mail
   */
  async deleteMail(id: string): AsyncResult<void> {
    try {
      const response = await this.apiClient.delete(`/courrier/${id}`);

      if (response.isFailure()) {
        if (response.error.message.includes('404')) {
          return failure(new NotFoundFailure('Mail not found'));
        }
        return failure(response.error);
      }

      return success(undefined);

    } catch (error) {
      return failure(new NetworkFailure('Delete mail failed', undefined, error as Error));
    }
  }

  /**
   * Search mails by text query
   */
  async searchMails(query: string, filters?: Partial<MailFilters>): AsyncResult<MailListResponse> {
    try {
      const searchFilters = {
        ...this.mapFiltersToAPI(filters),
        query,
      };
      
      const response = await this.apiClient.get<MailListResponseAPI>('/courrier/search', searchFilters);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const mails = data.mails.map(mailData => {
        const mailModel = MailItemModelImpl.fromAPI(mailData);
        return this.courrierMapper.toDomain(mailModel);
      });

      return success({
        mails,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });

    } catch (error) {
      return failure(new NetworkFailure('Search mails failed', undefined, error as Error));
    }
  }

  /**
   * Get mail history
   */
  async getMailHistory(filters?: Partial<MailFilters>): AsyncResult<MailListResponse> {
    try {
      const apiFilters = this.mapFiltersToAPI(filters);
      const response = await this.apiClient.get<MailListResponseAPI>('/courrier/history', apiFilters);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const mails = data.mails.map(mailData => {
        const mailModel = MailItemModelImpl.fromAPI(mailData);
        return this.courrierMapper.toDomain(mailModel);
      });

      return success({
        mails,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });

    } catch (error) {
      return failure(new NetworkFailure('Get mail history failed', undefined, error as Error));
    }
  }

  /**
   * Get mail detail with full information
   */
  async getMailDetail(id: string): AsyncResult<MailItem> {
    try {
      const response = await this.apiClient.get(`/courrier/${id}/detail`);

      if (response.isFailure()) {
        if (response.error.message.includes('404')) {
          return failure(new NotFoundFailure('Mail not found'));
        }
        return failure(response.error);
      }

      const data = response.value.data;
      const mailModel = MailItemModelImpl.fromAPI(data);
      const mail = this.courrierMapper.toDomain(mailModel);

      return success(mail);

    } catch (error) {
      return failure(new NetworkFailure('Get mail detail failed', undefined, error as Error));
    }
  }

  /**
   * Map filters from domain to API
   */
  private mapFiltersToAPI(filters?: Partial<MailFilters>): MailFiltersAPI {
    if (!filters) return {};

    return {
      type: filters.type,
      status: filters.status,
      priority: filters.priority,
      category: filters.category,
      query: filters.query,
      tags: filters.tags,
      dateFrom: filters.dateFrom?.toISOString(),
      dateTo: filters.dateTo?.toISOString(),
      assignedTo: filters.assignedTo,
      hasAttachments: filters.hasAttachments,
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
  }

  /**
   * Map create params from domain to API
   */
  private mapCreateParamsToAPI(params: CreateMailParams): CreateMailParamsAPI {
    return {
      type: params.type,
      subject: params.subject,
      description: params.description,
      sender: params.sender,
      recipient: params.recipient,
      category: params.category,
      priority: params.priority,
      attachments: params.attachments,
      tags: params.tags,
      assignedTo: params.assignedTo,
    };
  }

  /**
   * Map update params from domain to API
   */
  private mapUpdateParamsToAPI(params: UpdateMailParams): UpdateMailParamsAPI {
    return {
      subject: params.subject,
      description: params.description,
      status: params.status,
      category: params.category,
      priority: params.priority,
      assignedTo: params.assignedTo,
      tags: params.tags,
    };
  }
}
