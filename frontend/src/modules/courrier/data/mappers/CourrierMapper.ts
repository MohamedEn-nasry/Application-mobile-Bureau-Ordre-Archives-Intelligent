import { BaseMapper } from '../../../../core/utils/mapper';
import { MailItem, MailType, MailStatus, MailPriority, MailItemImpl, MailAttachment, MailAlternativeCategory, MailTimelineEvent } from '../../domain/entities/MailItem';
import { MailItemModel, MailItemModelImpl, MailTypeModel, MailStatusModel, MailPriorityModel, MailAttachmentModel, MailAlternativeCategoryModel, MailTimelineEventModel } from '../models/MailItemModel';

/**
 * Mapper for transforming between MailItem domain entities and MailItemModel data models
 */
export class CourrierMapper extends BaseMapper<MailItemModel, MailItem> {
  /**
   * Convert MailItemModel to MailItem domain entity
   */
  toDomain(from: MailItemModel): MailItem {
    if (!from.id) {
      throw new Error('MailItemModel must have an ID to convert to domain entity');
    }

    return new MailItemImpl(
      from.id.toString(),
      from.reference || '',
      this.mapType(from.type),
      from.subject || '',
      from.description || '',
      from.sender,
      from.recipient,
      this.mapStatus(from.status || MailStatusModel.PENDING),
      this.mapPriority(from.priority),
      from.category || '',
      from.dateReceived ? new Date(from.dateReceived) : undefined,
      from.dateSent ? new Date(from.dateSent) : undefined,
      this.mapAttachments(from.attachments || []),
      from.tags || [],
      from.assignedTo,
      from.confidence,
      from.ocrText,
      this.mapAlternativeCategories(from.alternativeCategories || []),
      this.mapTimelineEvents(from.timeline || []),
      from.created_at ? new Date(from.created_at) : new Date(),
      from.updated_at ? new Date(from.updated_at) : new Date()
    );
  }

  /**
   * Convert MailItem domain entity to MailItemModel
   */
  fromDomain(to: MailItem): MailItemModel {
    const model = new MailItemModelImpl();
    model.id = to.id;
    model.reference = to.reference;
    model.type = this.mapTypeToModel(to.type);
    model.subject = to.subject;
    model.description = to.description;
    model.sender = to.sender;
    model.recipient = to.recipient;
    model.status = this.mapStatusToModel(to.status);
    model.priority = this.mapPriorityToModel(to.priority);
    model.category = to.category;
    model.dateReceived = to.dateReceived?.toISOString();
    model.dateSent = to.dateSent?.toISOString();
    model.attachments = this.mapAttachmentsToModel(to.attachments);
    model.tags = to.tags;
    model.assignedTo = to.assignedTo;
    model.confidence = to.confidence;
    model.ocrText = to.ocrText;
    model.alternativeCategories = this.mapAlternativeCategoriesToModel(to.alternativeCategories);
    model.timeline = this.mapTimelineEventsToModel(to.timeline);
    model.created_at = to.createdAt.toISOString();
    model.updated_at = to.updatedAt.toISOString();
    
    return model;
  }

  /**
   * Map type from model to domain
   */
  private mapType(type?: MailTypeModel): MailType {
    switch (type) {
      case MailTypeModel.INCOMING:
        return MailType.INCOMING;
      case MailTypeModel.OUTGOING:
        return MailType.OUTGOING;
      default:
        return MailType.INCOMING; // Default fallback
    }
  }

  /**
   * Map type from domain to model
   */
  private mapTypeToModel(type: MailType): MailTypeModel {
    switch (type) {
      case MailType.INCOMING:
        return MailTypeModel.INCOMING;
      case MailType.OUTGOING:
        return MailTypeModel.OUTGOING;
      default:
        return MailTypeModel.INCOMING; // Default fallback
    }
  }

  /**
   * Map status from model to domain
   */
  private mapStatus(status?: MailStatusModel): MailStatus {
    switch (status) {
      case MailStatusModel.PENDING:
        return MailStatus.PENDING;
      case MailStatusModel.PROCESSED:
        return MailStatus.PROCESSED;
      case MailStatusModel.URGENT:
        return MailStatus.URGENT;
      case MailStatusModel.ARCHIVED:
        return MailStatus.ARCHIVED;
      case MailStatusModel.SENT:
        return MailStatus.SENT;
      default:
        return MailStatus.PENDING; // Default fallback for undefined
    }
  }

  /**
   * Map status from domain to model
   */
  private mapStatusToModel(status: MailStatus): MailStatusModel {
    switch (status) {
      case MailStatus.PENDING:
        return MailStatusModel.PENDING;
      case MailStatus.PROCESSED:
        return MailStatusModel.PROCESSED;
      case MailStatus.URGENT:
        return MailStatusModel.URGENT;
      case MailStatus.ARCHIVED:
        return MailStatusModel.ARCHIVED;
      case MailStatus.SENT:
        return MailStatusModel.SENT;
      default:
        return MailStatusModel.PENDING; // Default fallback
    }
  }

  /**
   * Map priority from model to domain
   */
  private mapPriority(priority?: MailPriorityModel): MailPriority {
    switch (priority) {
      case MailPriorityModel.LOW:
        return MailPriority.LOW;
      case MailPriorityModel.NORMAL:
        return MailPriority.NORMAL;
      case MailPriorityModel.HIGH:
        return MailPriority.HIGH;
      case MailPriorityModel.URGENT:
        return MailPriority.URGENT;
      default:
        return MailPriority.NORMAL; // Default fallback
    }
  }

  /**
   * Map priority from domain to model
   */
  private mapPriorityToModel(priority: MailPriority): MailPriorityModel {
    switch (priority) {
      case MailPriority.LOW:
        return MailPriorityModel.LOW;
      case MailPriority.NORMAL:
        return MailPriorityModel.NORMAL;
      case MailPriority.HIGH:
        return MailPriorityModel.HIGH;
      case MailPriority.URGENT:
        return MailPriorityModel.URGENT;
      default:
        return MailPriorityModel.NORMAL; // Default fallback
    }
  }

  /**
   * Map attachments from model to domain
   */
  private mapAttachments(attachments: MailAttachmentModel[]): MailAttachment[] {
    return attachments.map(attachment => ({
      name: attachment.name || '',
      type: attachment.type || '',
      size: attachment.size || '',
      url: attachment.url,
    }));
  }

  /**
   * Map attachments from domain to model
   */
  private mapAttachmentsToModel(attachments: MailAttachment[]): MailAttachmentModel[] {
    return attachments.map(attachment => ({
      name: attachment.name,
      type: attachment.type,
      size: attachment.size,
      url: attachment.url,
    }));
  }

  /**
   * Map alternative categories from model to domain
   */
  private mapAlternativeCategories(categories: MailAlternativeCategoryModel[]): MailAlternativeCategory[] {
    return categories.map(category => ({
      label: category.label || '',
      confidence: category.confidence || 0,
    }));
  }

  /**
   * Map alternative categories from domain to model
   */
  private mapAlternativeCategoriesToModel(categories: MailAlternativeCategory[]): MailAlternativeCategoryModel[] {
    return categories.map(category => ({
      label: category.label,
      confidence: category.confidence,
    }));
  }

  /**
   * Map timeline events from model to domain
   */
  private mapTimelineEvents(events: MailTimelineEventModel[]): MailTimelineEvent[] {
    return events.map(event => ({
      label: event.label || '',
      date: event.date || '',
      color: event.color || '#000000',
    }));
  }

  /**
   * Map timeline events from domain to model
   */
  private mapTimelineEventsToModel(events: MailTimelineEvent[]): MailTimelineEventModel[] {
    return events.map(event => ({
      label: event.label,
      date: event.date,
      color: event.color,
    }));
  }
}
