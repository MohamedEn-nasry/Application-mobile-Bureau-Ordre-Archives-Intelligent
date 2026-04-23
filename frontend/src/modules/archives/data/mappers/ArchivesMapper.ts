import { BaseMapper } from '../../../../core/utils/mapper';
import { ArchiveItem, ArchiveStatus, ArchiveCategory, ArchiveItemImpl } from '../../domain/entities/ArchiveItem';
import { ArchiveItemModel, ArchiveItemModelImpl, ArchiveStatusModel, ArchiveCategoryModel } from '../models/ArchiveItemModel';

/**
 * Mapper for transforming between ArchiveItem domain entities and ArchiveItemModel data models
 */
export class ArchivesMapper extends BaseMapper<ArchiveItemModel, ArchiveItem> {
  /**
   * Convert ArchiveItemModel to ArchiveItem domain entity
   */
  toDomain(from: ArchiveItemModel): ArchiveItem {
    if (!from.id) {
      throw new Error('ArchiveItemModel must have an ID to convert to domain entity');
    }

    return new ArchiveItemImpl(
      from.id.toString(),
      from.title || '',
      from.description || '',
      this.mapCategory(from.category),
      this.mapStatus(from.status),
      from.reference || '',
      from.archivedDate ? new Date(from.archivedDate) : new Date(),
      from.expiryDate ? new Date(from.expiryDate) : undefined,
      from.documentCount || 0,
      from.size || 0,
      from.tags || [],
      from.createdBy,
      from.archivedBy,
      from.created_at ? new Date(from.created_at) : new Date(),
      from.updated_at ? new Date(from.updated_at) : new Date()
    );
  }

  /**
   * Convert ArchiveItem domain entity to ArchiveItemModel
   */
  fromDomain(to: ArchiveItem): ArchiveItemModel {
    const model = new ArchiveItemModelImpl();
    model.id = to.id;
    model.title = to.title;
    model.description = to.description;
    model.category = this.mapCategoryToModel(to.category);
    model.status = this.mapStatusToModel(to.status);
    model.reference = to.reference;
    model.archivedDate = to.archivedDate.toISOString();
    model.expiryDate = to.expiryDate?.toISOString();
    model.documentCount = to.documentCount;
    model.size = to.size;
    model.tags = to.tags;
    model.createdBy = to.createdBy;
    model.archivedBy = to.archivedBy;
    model.created_at = to.createdAt.toISOString();
    model.updated_at = to.updatedAt.toISOString();
    
    return model;
  }

  /**
   * Map category from model to domain
   */
  private mapCategory(category?: ArchiveCategoryModel): ArchiveCategory {
    switch (category) {
      case ArchiveCategoryModel.FINANCE:
        return ArchiveCategory.FINANCE;
      case ArchiveCategoryModel.RH:
        return ArchiveCategory.RH;
      case ArchiveCategoryModel.TECHNIQUE:
        return ArchiveCategory.TECHNIQUE;
      case ArchiveCategoryModel.JURIDIQUE:
        return ArchiveCategory.JURIDIQUE;
      case ArchiveCategoryModel.ADMINISTRATIF:
        return ArchiveCategory.ADMINISTRATIF;
      case ArchiveCategoryModel.AUTRE:
        return ArchiveCategory.AUTRE;
      default:
        return ArchiveCategory.ADMINISTRATIF; // Default fallback
    }
  }

  /**
   * Map category from domain to model
   */
  private mapCategoryToModel(category: ArchiveCategory): ArchiveCategoryModel {
    switch (category) {
      case ArchiveCategory.FINANCE:
        return ArchiveCategoryModel.FINANCE;
      case ArchiveCategory.RH:
        return ArchiveCategoryModel.RH;
      case ArchiveCategory.TECHNIQUE:
        return ArchiveCategoryModel.TECHNIQUE;
      case ArchiveCategory.JURIDIQUE:
        return ArchiveCategoryModel.JURIDIQUE;
      case ArchiveCategory.ADMINISTRATIF:
        return ArchiveCategoryModel.ADMINISTRATIF;
      case ArchiveCategory.AUTRE:
        return ArchiveCategoryModel.AUTRE;
      default:
        return ArchiveCategoryModel.ADMINISTRATIF; // Default fallback
    }
  }

  /**
   * Map status from model to domain
   */
  private mapStatus(status?: ArchiveStatusModel): ArchiveStatus {
    switch (status) {
      case ArchiveStatusModel.ACTIVE:
        return ArchiveStatus.ACTIVE;
      case ArchiveStatusModel.ARCHIVED:
        return ArchiveStatus.ARCHIVED;
      case ArchiveStatusModel.PENDING:
        return ArchiveStatus.PENDING;
      case ArchiveStatusModel.EXPIRED:
        return ArchiveStatus.EXPIRED;
      default:
        return ArchiveStatus.ACTIVE; // Default fallback
    }
  }

  /**
   * Map status from domain to model
   */
  private mapStatusToModel(status: ArchiveStatus): ArchiveStatusModel {
    switch (status) {
      case ArchiveStatus.ACTIVE:
        return ArchiveStatusModel.ACTIVE;
      case ArchiveStatus.ARCHIVED:
        return ArchiveStatusModel.ARCHIVED;
      case ArchiveStatus.PENDING:
        return ArchiveStatusModel.PENDING;
      case ArchiveStatus.EXPIRED:
        return ArchiveStatusModel.EXPIRED;
      default:
        return ArchiveStatusModel.ACTIVE; // Default fallback
    }
  }
}
