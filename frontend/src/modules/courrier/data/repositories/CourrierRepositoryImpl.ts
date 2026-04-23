import { success, failure, AsyncResult } from '../../../../core/utils/result';
import { CourrierRepository, MailListResponse, CreateMailParams, UpdateMailParams } from '../../domain/repositories/CourrierRepository';
import { MailItem, MailStatus } from '../../domain/entities/MailItem';
import { MailFilters } from '../../domain/entities/MailFilters';
import { CourrierRemoteDataSource } from '../datasources/CourrierRemoteDataSource';
import { BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Courrier repository implementation
 * Implements the CourrierRepository interface using remote data source
 */
export class CourrierRepositoryImpl implements CourrierRepository {
  constructor(private readonly remoteDataSource: CourrierRemoteDataSource) {}

  /**
   * Get mail by ID
   */
  async findById(id: string): AsyncResult<MailItem> {
    try {
      const result = await this.remoteDataSource.getMailById(id);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get mail by ID', 'GET_MAIL_BY_ID_ERROR')
      );
    }
  }

  /**
   * Get list of mails with optional filters
   */
  async getMails(filters?: MailFilters): AsyncResult<MailListResponse> {
    try {
      const result = await this.remoteDataSource.getMails(filters);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get mails', 'GET_MAILS_ERROR')
      );
    }
  }

  /**
   * Get incoming mails
   */
  async getIncomingMails(filters?: Partial<MailFilters>): AsyncResult<MailListResponse> {
    try {
      const result = await this.remoteDataSource.getIncomingMails(filters);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get incoming mails', 'GET_INCOMING_MAILS_ERROR')
      );
    }
  }

  /**
   * Get outgoing mails
   */
  async getOutgoingMails(filters?: Partial<MailFilters>): AsyncResult<MailListResponse> {
    try {
      const result = await this.remoteDataSource.getOutgoingMails(filters);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get outgoing mails', 'GET_OUTGOING_MAILS_ERROR')
      );
    }
  }

  /**
   * Create a new mail
   */
  async createMail(params: CreateMailParams): AsyncResult<MailItem> {
    try {
      const result = await this.remoteDataSource.createMail(params);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to create mail', 'CREATE_MAIL_ERROR')
      );
    }
  }

  /**
   * Create incoming mail
   */
  async createIncomingMail(params: Omit<CreateMailParams, 'type'>): AsyncResult<MailItem> {
    try {
      const result = await this.remoteDataSource.createIncomingMail(params);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to create incoming mail', 'CREATE_INCOMING_MAIL_ERROR')
      );
    }
  }

  /**
   * Create outgoing mail
   */
  async createOutgoingMail(params: Omit<CreateMailParams, 'type'>): AsyncResult<MailItem> {
    try {
      const result = await this.remoteDataSource.createOutgoingMail(params);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to create outgoing mail', 'CREATE_OUTGOING_MAIL_ERROR')
      );
    }
  }

  /**
   * Update an existing mail
   */
  async updateMail(id: string, params: UpdateMailParams): AsyncResult<MailItem> {
    try {
      const result = await this.remoteDataSource.updateMail(id, params);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to update mail', 'UPDATE_MAIL_ERROR')
      );
    }
  }

  /**
   * Update mail status
   */
  async updateMailStatus(id: string, status: MailStatus): AsyncResult<MailItem> {
    try {
      const result = await this.remoteDataSource.updateMailStatus(id, status);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to update mail status', 'UPDATE_MAIL_STATUS_ERROR')
      );
    }
  }

  /**
   * Delete a mail
   */
  async deleteMail(id: string): AsyncResult<void> {
    try {
      const result = await this.remoteDataSource.deleteMail(id);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to delete mail', 'DELETE_MAIL_ERROR')
      );
    }
  }

  /**
   * Search mails by text query
   */
  async searchMails(query: string, filters?: Partial<MailFilters>): AsyncResult<MailListResponse> {
    try {
      const result = await this.remoteDataSource.searchMails(query, filters);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to search mails', 'SEARCH_MAILS_ERROR')
      );
    }
  }

  /**
   * Get mail history
   */
  async getMailHistory(filters?: Partial<MailFilters>): AsyncResult<MailListResponse> {
    try {
      const result = await this.remoteDataSource.getMailHistory(filters);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get mail history', 'GET_MAIL_HISTORY_ERROR')
      );
    }
  }

  /**
   * Get mail detail with full information
   */
  async getMailDetail(id: string): AsyncResult<MailItem> {
    try {
      const result = await this.remoteDataSource.getMailDetail(id);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get mail detail', 'GET_MAIL_DETAIL_ERROR')
      );
    }
  }

  /**
   * Get mails by status
   */
  async getMailsByStatus(status: MailStatus): AsyncResult<MailItem[]> {
    try {
      const result = await this.remoteDataSource.getMails({ status });
      
      if (result.isFailure()) {
        return failure(result.error);
      }

      return success(result.value.mails);
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get mails by status', 'GET_MAILS_BY_STATUS_ERROR')
      );
    }
  }

  /**
   * Get mails assigned to user
   */
  async getMailsAssignedTo(userId: string): AsyncResult<MailItem[]> {
    try {
      const result = await this.remoteDataSource.getMails({ assignedTo: userId });
      
      if (result.isFailure()) {
        return failure(result.error);
      }

      return success(result.value.mails);
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get mails assigned to user', 'GET_MAILS_ASSIGNED_TO_ERROR')
      );
    }
  }

  /**
   * Get mail statistics
   */
  async getMailStats(): AsyncResult<{
    total: number;
    incoming: number;
    outgoing: number;
    pending: number;
    processed: number;
    urgent: number;
    byCategory: Record<string, number>;
    byStatus: Record<MailStatus, number>;
  }> {
    try {
      const result = await this.remoteDataSource.getMails({ limit: 1000 }); // Get all mails for stats
      
      if (result.isFailure()) {
        return failure(result.error);
      }

      const mails = result.value.mails;
      
      // Calculate statistics
      const stats = {
        total: mails.length,
        incoming: mails.filter(mail => mail.type === 'incoming').length,
        outgoing: mails.filter(mail => mail.type === 'outgoing').length,
        pending: mails.filter(mail => mail.status === MailStatus.PENDING).length,
        processed: mails.filter(mail => mail.status === MailStatus.PROCESSED).length,
        urgent: mails.filter(mail => mail.priority === 'urgent' || mail.status === MailStatus.URGENT).length,
        byCategory: {} as Record<string, number>,
        byStatus: {} as Record<MailStatus, number>,
      };

      // Count by category
      mails.forEach(mail => {
        stats.byCategory[mail.category] = (stats.byCategory[mail.category] || 0) + 1;
      });

      // Count by status
      Object.values(MailStatus).forEach(status => {
        stats.byStatus[status] = mails.filter(mail => mail.status === status).length;
      });

      return success(stats);
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get mail statistics', 'GET_MAIL_STATS_ERROR')
      );
    }
  }

  /**
   * Add tag to mail
   */
  async addTagToMail(id: string, tag: string): AsyncResult<MailItem> {
    try {
      // First get the current mail
      const getResult = await this.remoteDataSource.getMailById(id);
      if (getResult.isFailure()) {
        return getResult;
      }

      const currentMail = getResult.value;
      
      // Add tag if it doesn't exist
      if (currentMail.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
        return success(currentMail);
      }

      // Update mail with new tag
      const updatedTags = [...currentMail.tags, tag];
      const result = await this.remoteDataSource.updateMail(id, { tags: updatedTags });
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to add tag to mail', 'ADD_TAG_TO_MAIL_ERROR')
      );
    }
  }

  /**
   * Remove tag from mail
   */
  async removeTagFromMail(id: string, tag: string): AsyncResult<MailItem> {
    try {
      // First get the current mail
      const getResult = await this.remoteDataSource.getMailById(id);
      if (getResult.isFailure()) {
        return getResult;
      }

      const currentMail = getResult.value;
      
      // Remove tag if it exists
      if (!currentMail.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
        return success(currentMail);
      }

      // Update mail without the tag
      const updatedTags = currentMail.tags.filter(t => t.toLowerCase() !== tag.toLowerCase());
      const result = await this.remoteDataSource.updateMail(id, { tags: updatedTags });
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to remove tag from mail', 'REMOVE_TAG_FROM_MAIL_ERROR')
      );
    }
  }

  /**
   * Assign mail to user
   */
  async assignMail(id: string, userId: string): AsyncResult<MailItem> {
    try {
      const result = await this.remoteDataSource.updateMail(id, { assignedTo: userId });
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to assign mail', 'ASSIGN_MAIL_ERROR')
      );
    }
  }

  /**
   * Unassign mail
   */
  async unassignMail(id: string): AsyncResult<MailItem> {
    try {
      const result = await this.remoteDataSource.updateMail(id, { assignedTo: undefined });
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to unassign mail', 'UNASSIGN_MAIL_ERROR')
      );
    }
  }
}
