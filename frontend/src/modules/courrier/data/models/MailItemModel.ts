import { BaseModelImpl } from '../../../../core/base/BaseModel';

/**
 * Mail type enum for data layer
 */
export enum MailTypeModel {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

/**
 * Mail status enum for data layer
 */
export enum MailStatusModel {
  PENDING = 'Pending',
  PROCESSED = 'Processed',
  URGENT = 'Urgent',
  ARCHIVED = 'Archived',
  SENT = 'Sent',
}

/**
 * Mail priority enum for data layer
 */
export enum MailPriorityModel {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Mail attachment interface for data layer
 */
export interface MailAttachmentModel {
  name?: string;
  type?: string;
  size?: string;
  url?: string;
}

/**
 * Mail alternative category interface for data layer
 */
export interface MailAlternativeCategoryModel {
  label?: string;
  confidence?: number;
}

/**
 * Mail timeline event interface for data layer
 */
export interface MailTimelineEventModel {
  label?: string;
  date?: string;
  color?: string;
}

/**
 * Mail item data model
 * Represents mail data from external sources (API, database, etc.)
 */
export interface MailItemModel extends BaseModelImpl {
  id?: string | number;
  reference?: string;
  type?: MailTypeModel;
  subject?: string;
  description?: string;
  sender?: string;
  recipient?: string;
  status?: MailStatusModel;
  priority?: MailPriorityModel;
  category?: string;
  dateReceived?: string;
  dateSent?: string;
  attachments?: MailAttachmentModel[];
  tags?: string[];
  assignedTo?: string;
  confidence?: number;
  ocrText?: string;
  alternativeCategories?: MailAlternativeCategoryModel[];
  timeline?: MailTimelineEventModel[];
}

/**
 * Mail item model implementation
 */
export class MailItemModelImpl extends BaseModelImpl implements MailItemModel {
  public reference?: string;
  public type?: MailTypeModel;
  public subject?: string;
  public description?: string;
  public sender?: string;
  public recipient?: string;
  public status?: MailStatusModel;
  public priority?: MailPriorityModel;
  public category?: string;
  public dateReceived?: string;
  public dateSent?: string;
  public attachments?: MailAttachmentModel[];
  public tags?: string[];
  public assignedTo?: string;
  public confidence?: number;
  public ocrText?: string;
  public alternativeCategories?: MailAlternativeCategoryModel[];
  public timeline?: MailTimelineEventModel[];

  /**
   * Validate mail item model structure
   */
  validate(): boolean {
    return !!(this.id && this.reference && this.subject);
  }

  /**
   * Create from API response
   */
  static fromAPI(data: any): MailItemModel {
    const model = new MailItemModelImpl();
    Object.assign(model, {
      id: data.id,
      reference: data.reference,
      type: data.type,
      subject: data.subject,
      description: data.description,
      sender: data.sender,
      recipient: data.recipient,
      status: data.status || MailStatusModel.PENDING,
      priority: data.priority || MailPriorityModel.NORMAL,
      category: data.category,
      dateReceived: data.dateReceived,
      dateSent: data.dateSent,
      attachments: data.attachments || [],
      tags: data.tags || [],
      assignedTo: data.assignedTo,
      confidence: data.confidence,
      ocrText: data.ocrText,
      alternativeCategories: data.alternativeCategories || [],
      timeline: data.timeline || [],
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
    return model;
  }

  /**
   * Convert to API payload
   */
  toAPIPayload(): Record<string, any> {
    const payload = super.toAPIPayload();
    
    // Convert enums to strings
    if (this.type) {
      payload.type = this.type;
    }
    
    if (this.status) {
      payload.status = this.status;
    }
    
    if (this.priority) {
      payload.priority = this.priority;
    }
    
    return payload;
  }
}
