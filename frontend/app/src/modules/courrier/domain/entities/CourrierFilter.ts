import { CourrierStatus, CourrierPriority } from './OutgoingCourrier';

export interface CourrierFilter {
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  recipient?: string;
  subject?: string;
  status?: CourrierStatus;
  priority?: CourrierPriority;
  createdBy?: string;
  page?: number;
  limit?: number;
  sortBy?: 'dateSent' | 'subject' | 'recipient' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export class CourrierFilterBuilder {
  private filter: CourrierFilter = {};

  withDateRange(startDate: Date, endDate: Date): CourrierFilterBuilder {
    this.filter.dateRange = { startDate, endDate };
    return this;
  }

  withRecipient(recipient: string): CourrierFilterBuilder {
    this.filter.recipient = recipient;
    return this;
  }

  withSubject(subject: string): CourrierFilterBuilder {
    this.filter.subject = subject;
    return this;
  }

  withStatus(status: CourrierStatus): CourrierFilterBuilder {
    this.filter.status = status;
    return this;
  }

  withPriority(priority: CourrierPriority): CourrierFilterBuilder {
    this.filter.priority = priority;
    return this;
  }

  withCreatedBy(createdBy: string): CourrierFilterBuilder {
    this.filter.createdBy = createdBy;
    return this;
  }

  withPagination(page: number, limit: number): CourrierFilterBuilder {
    this.filter.page = page;
    this.filter.limit = limit;
    return this;
  }

  withSort(sortBy: 'dateSent' | 'subject' | 'recipient' | 'priority', sortOrder: 'asc' | 'desc' = 'desc'): CourrierFilterBuilder {
    this.filter.sortBy = sortBy;
    this.filter.sortOrder = sortOrder;
    return this;
  }

  build(): CourrierFilter {
    return { ...this.filter };
  }
}
