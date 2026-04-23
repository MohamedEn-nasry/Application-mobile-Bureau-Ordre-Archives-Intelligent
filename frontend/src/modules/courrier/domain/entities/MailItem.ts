import { BaseEntity } from '../../../../core/base/BaseEntity';

/**
 * Mail type enum
 */
export enum MailType {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

/**
 * Mail status enum
 */
export enum MailStatus {
  PENDING = 'Pending',
  PROCESSED = 'Processed',
  URGENT = 'Urgent',
  ARCHIVED = 'Archived',
  SENT = 'Sent',
}

/**
 * Mail priority enum
 */
export enum MailPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Mail item domain entity
 */
export interface MailItem extends BaseEntity {
  readonly reference: string;
  readonly type: MailType;
  readonly subject: string;
  readonly description: string;
  readonly sender?: string;
  readonly recipient?: string;
  readonly status: MailStatus;
  readonly priority: MailPriority;
  readonly category: string;
  readonly dateReceived?: Date;
  readonly dateSent?: Date;
  readonly attachments: MailAttachment[];
  readonly tags: string[];
  readonly assignedTo?: string;
  readonly confidence?: number;
  readonly ocrText?: string;
  readonly alternativeCategories?: MailAlternativeCategory[];
  readonly timeline: MailTimelineEvent[];
}

/**
 * Mail attachment interface
 */
export interface MailAttachment {
  readonly name: string;
  readonly type: string;
  readonly size: string;
  readonly url?: string;
}

/**
 * Mail alternative category interface
 */
export interface MailAlternativeCategory {
  readonly label: string;
  readonly confidence: number;
}

/**
 * Mail timeline event interface
 */
export interface MailTimelineEvent {
  readonly label: string;
  readonly date: string;
  readonly color: string;
}

/**
 * Mail item implementation
 */
export class MailItemImpl implements MailItem {
  constructor(
    public readonly id: string,
    public readonly reference: string,
    public readonly type: MailType,
    public readonly subject: string,
    public readonly description: string,
    public readonly status: MailStatus,
    public readonly priority: MailPriority,
    public readonly category: string,
    public readonly sender?: string,
    public readonly recipient?: string,
    public readonly dateReceived?: Date,
    public readonly dateSent?: Date,
    public readonly attachments: MailAttachment[] = [],
    public readonly tags: string[] = [],
    public readonly assignedTo?: string,
    public readonly confidence?: number,
    public readonly ocrText?: string,
    public readonly alternativeCategories: MailAlternativeCategory[] = [],
    public readonly timeline: MailTimelineEvent[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Check if mail is incoming
   */
  isIncoming(): boolean {
    return this.type === MailType.INCOMING;
  }

  /**
   * Check if mail is outgoing
   */
  isOutgoing(): boolean {
    return this.type === MailType.OUTGOING;
  }

  /**
   * Check if mail is urgent
   */
  isUrgent(): boolean {
    return this.priority === MailPriority.URGENT || this.status === MailStatus.URGENT;
  }

  /**
   * Check if mail is processed
   */
  isProcessed(): boolean {
    return this.status === MailStatus.PROCESSED;
  }

  /**
   * Check if mail has attachments
   */
  hasAttachments(): boolean {
    return this.attachments.length > 0;
  }

  /**
   * Get total attachment size
   */
  getTotalAttachmentSize(): number {
    return this.attachments.reduce((total, attachment) => {
      const size = parseFloat(attachment.size.replace(/[^0-9.]/g, ''));
      const unit = attachment.size.replace(/[0-9.]/g, '').toLowerCase();
      
      let bytes = size;
      if (unit.includes('ko')) bytes = size * 1024;
      else if (unit.includes('mo')) bytes = size * 1024 * 1024;
      else if (unit.includes('go')) bytes = size * 1024 * 1024 * 1024;
      
      return total + bytes;
    }, 0);
  }

  /**
   * Check if mail has specific tag
   */
  hasTag(tag: string): boolean {
    return this.tags.some(t => t.toLowerCase() === tag.toLowerCase());
  }

  /**
   * Get formatted date
   */
  getFormattedDate(): string {
    const date = this.dateReceived || this.dateSent;
    if (!date) return '';
    return date.toLocaleDateString('fr-FR');
  }

  /**
   * Create a copy with updated status
   */
  withStatus(status: MailStatus): MailItem {
    return new MailItemImpl(
      this.id,
      this.reference,
      this.type,
      this.subject,
      this.description,
      status,
      this.priority,
      this.category,
      this.sender,
      this.recipient,
      this.dateReceived,
      this.dateSent,
      this.attachments,
      this.tags,
      this.assignedTo,
      this.confidence,
      this.ocrText,
      this.alternativeCategories,
      this.timeline,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Add a tag
   */
  withAddedTag(tag: string): MailItem {
    if (this.hasTag(tag)) return this;
    
    return new MailItemImpl(
      this.id,
      this.reference,
      this.type,
      this.subject,
      this.description,
      this.status,
      this.priority,
      this.category,
      this.sender,
      this.recipient,
      this.dateReceived,
      this.dateSent,
      this.attachments,
      [...this.tags, tag],
      this.assignedTo,
      this.confidence,
      this.ocrText,
      this.alternativeCategories,
      this.timeline,
      this.createdAt,
      new Date()
    );
  }
}
