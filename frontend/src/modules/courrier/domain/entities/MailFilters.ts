import { MailType, MailStatus, MailPriority } from './MailItem';

/**
 * Mail search filters interface
 */
export interface MailFilters {
  readonly type?: MailType;
  readonly status?: MailStatus;
  readonly priority?: MailPriority;
  readonly category?: string;
  readonly query?: string;
  readonly tags?: string[];
  readonly dateFrom?: Date;
  readonly dateTo?: Date;
  readonly assignedTo?: string;
  readonly hasAttachments?: boolean;
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: 'date' | 'subject' | 'sender' | 'priority';
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Mail filters implementation
 */
export class MailFiltersImpl implements MailFilters {
  constructor(
    public readonly type?: MailType,
    public readonly status?: MailStatus,
    public readonly priority?: MailPriority,
    public readonly category?: string,
    public readonly query?: string,
    public readonly tags?: string[],
    public readonly dateFrom?: Date,
    public readonly dateTo?: Date,
    public readonly assignedTo?: string,
    public readonly hasAttachments?: boolean,
    public readonly page?: number,
    public readonly limit?: number,
    public readonly sortBy?: 'date' | 'subject' | 'sender' | 'priority',
    public readonly sortOrder?: 'asc' | 'desc'
  ) {}

  /**
   * Create a copy with updated filters
   */
  withFilters(updates: Partial<MailFilters>): MailFilters {
    return new MailFiltersImpl(
      updates.type ?? this.type,
      updates.status ?? this.status,
      updates.priority ?? this.priority,
      updates.category ?? this.category,
      updates.query ?? this.query,
      updates.tags ?? this.tags,
      updates.dateFrom ?? this.dateFrom,
      updates.dateTo ?? this.dateTo,
      updates.assignedTo ?? this.assignedTo,
      updates.hasAttachments ?? this.hasAttachments,
      updates.page ?? this.page,
      updates.limit ?? this.limit,
      updates.sortBy ?? this.sortBy,
      updates.sortOrder ?? this.sortOrder
    );
  }

  /**
   * Create filters for incoming mail
   */
  static incoming(): MailFilters {
    return new MailFiltersImpl(MailType.INCOMING);
  }

  /**
   * Create filters for outgoing mail
   */
  static outgoing(): MailFilters {
    return new MailFiltersImpl(MailType.OUTGOING);
  }

  /**
   * Create filters for urgent mail
   */
  static urgent(): MailFilters {
    return new MailFiltersImpl(undefined, undefined, MailPriority.URGENT);
  }

  /**
   * Create filters for pending mail
   */
  static pending(): MailFilters {
    return new MailFiltersImpl(undefined, MailStatus.PENDING);
  }

  /**
   * Create filters with search query
   */
  static withQuery(query: string): MailFilters {
    return new MailFiltersImpl(undefined, undefined, undefined, undefined, query);
  }

  /**
   * Create filters for assigned mail
   */
  static assignedTo(userId: string): MailFilters {
    return new MailFiltersImpl(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, userId);
  }

  /**
   * Create filters with date range
   */
  static withDateRange(from: Date, to: Date): MailFilters {
    return new MailFiltersImpl(undefined, undefined, undefined, undefined, undefined, undefined, from, to);
  }

  /**
   * Create filters with pagination
   */
  static withPagination(page: number, limit: number = 20): MailFilters {
    return new MailFiltersImpl(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, page, limit);
  }

  /**
   * Check if filters are empty (no active filters)
   */
  isEmpty(): boolean {
    return !(
      this.type ||
      this.status ||
      this.priority ||
      this.category ||
      this.query ||
      (this.tags && this.tags.length > 0) ||
      this.dateFrom ||
      this.dateTo ||
      this.assignedTo ||
      this.hasAttachments !== undefined
    );
  }

  /**
   * Get filter summary for display
   */
  getSummary(): string {
    const parts: string[] = [];
    
    if (this.type) parts.push(this.type === MailType.INCOMING ? 'Entrants' : 'Sortants');
    if (this.status) parts.push(this.status);
    if (this.priority) parts.push(this.priority);
    if (this.category) parts.push(this.category);
    if (this.query) parts.push(`"${this.query}"`);
    if (this.assignedTo) parts.push(`Assigné à: ${this.assignedTo}`);
    if (this.hasAttachments) parts.push('Avec pièces jointes');
    
    return parts.join(' • ');
  }
}
