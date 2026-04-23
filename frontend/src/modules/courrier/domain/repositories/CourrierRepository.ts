import { Result, AsyncResult } from '../../../../core/utils/result';
import { MailItem, MailType, MailStatus } from '../entities/MailItem';
import { MailFilters } from '../entities/MailFilters';

/**
 * Paginated mail list response
 */
export interface MailListResponse {
  readonly mails: MailItem[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

/**
 * Mail creation parameters
 */
export interface CreateMailParams {
  readonly type: MailType;
  readonly subject: string;
  readonly description: string;
  readonly sender?: string;
  readonly recipient?: string;
  readonly category: string;
  readonly priority?: string;
  readonly attachments?: File[];
  readonly tags?: string[];
  readonly assignedTo?: string;
}

/**
 * Mail update parameters
 */
export interface UpdateMailParams {
  readonly subject?: string;
  readonly description?: string;
  readonly status?: MailStatus;
  readonly category?: string;
  readonly priority?: string;
  readonly assignedTo?: string;
  readonly tags?: string[];
}

/**
 * Courrier repository interface
 * Defines the contract for mail management operations
 */
export interface CourrierRepository {
  /**
   * Get mail by ID
   */
  findById(id: string): AsyncResult<MailItem>;

  /**
   * Get list of mails with optional filters
   */
  getMails(filters?: MailFilters): AsyncResult<MailListResponse>;

  /**
   * Get incoming mails
   */
  getIncomingMails(filters?: Partial<MailFilters>): AsyncResult<MailListResponse>;

  /**
   * Get outgoing mails
   */
  getOutgoingMails(filters?: Partial<MailFilters>): AsyncResult<MailListResponse>;

  /**
   * Create a new mail
   */
  createMail(params: CreateMailParams): AsyncResult<MailItem>;

  /**
   * Create incoming mail
   */
  createIncomingMail(params: Omit<CreateMailParams, 'type'>): AsyncResult<MailItem>;

  /**
   * Create outgoing mail
   */
  createOutgoingMail(params: Omit<CreateMailParams, 'type'>): AsyncResult<MailItem>;

  /**
   * Update an existing mail
   */
  updateMail(id: string, params: UpdateMailParams): AsyncResult<MailItem>;

  /**
   * Update mail status
   */
  updateMailStatus(id: string, status: MailStatus): AsyncResult<MailItem>;

  /**
   * Delete a mail
   */
  deleteMail(id: string): AsyncResult<void>;

  /**
   * Search mails by text query
   */
  searchMails(query: string, filters?: Partial<MailFilters>): AsyncResult<MailListResponse>;

  /**
   * Get mail history
   */
  getMailHistory(filters?: Partial<MailFilters>): AsyncResult<MailListResponse>;

  /**
   * Get mail detail with full information
   */
  getMailDetail(id: string): AsyncResult<MailItem>;

  /**
   * Get mails by status
   */
  getMailsByStatus(status: MailStatus): AsyncResult<MailItem[]>;

  /**
   * Get mails assigned to user
   */
  getMailsAssignedTo(userId: string): AsyncResult<MailItem[]>;

  /**
   * Get mail statistics
   */
  getMailStats(): AsyncResult<{
    total: number;
    incoming: number;
    outgoing: number;
    pending: number;
    processed: number;
    urgent: number;
    byCategory: Record<string, number>;
    byStatus: Record<MailStatus, number>;
  }>;

  /**
   * Add tag to mail
   */
  addTagToMail(id: string, tag: string): AsyncResult<MailItem>;

  /**
   * Remove tag from mail
   */
  removeTagFromMail(id: string, tag: string): AsyncResult<MailItem>;

  /**
   * Assign mail to user
   */
  assignMail(id: string, userId: string): AsyncResult<MailItem>;

  /**
   * Unassign mail
   */
  unassignMail(id: string): AsyncResult<MailItem>;
}
