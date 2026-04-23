import { BaseModelImpl } from '../../../../core/base/BaseModel';

/**
 * Archive status enum for data layer
 */
export enum ArchiveStatusModel {
  ACTIVE = 'Active',
  ARCHIVED = 'Archived',
  PENDING = 'Pending',
  EXPIRED = 'Expired',
}

/**
 * Archive category enum for data layer
 */
export enum ArchiveCategoryModel {
  FINANCE = 'Finance',
  RH = 'RH',
  TECHNIQUE = 'Technique',
  JURIDIQUE = 'Juridique',
  ADMINISTRATIF = 'Administratif',
  AUTRE = 'Autre',
}

/**
 * Archive item data model
 * Represents archive data from external sources (API, database, etc.)
 */
export interface ArchiveItemModel extends BaseModelImpl {
  id?: string | number;
  title?: string;
  description?: string;
  category?: ArchiveCategoryModel;
  status?: ArchiveStatusModel;
  reference?: string;
  archivedDate?: string;
  expiryDate?: string;
  documentCount?: number;
  size?: number;
  tags?: string[];
  createdBy?: string;
  archivedBy?: string;
}

/**
 * Archive item model implementation
 */
export class ArchiveItemModelImpl extends BaseModelImpl implements ArchiveItemModel {
  public title?: string;
  public description?: string;
  public category?: ArchiveCategoryModel;
  public status?: ArchiveStatusModel;
  public reference?: string;
  public archivedDate?: string;
  public expiryDate?: string;
  public documentCount?: number;
  public size?: number;
  public tags?: string[];
  public createdBy?: string;
  public archivedBy?: string;

  /**
   * Validate archive item model structure
   */
  validate(): boolean {
    return !!(this.id && this.title && this.reference);
  }

  /**
   * Create from API response
   */
  static fromAPI(data: any): ArchiveItemModel {
    const model = new ArchiveItemModelImpl();
    Object.assign(model, {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.status || ArchiveStatusModel.ACTIVE,
      reference: data.reference,
      archivedDate: data.archivedDate,
      expiryDate: data.expiryDate,
      documentCount: data.documentCount || 0,
      size: data.size || 0,
      tags: data.tags || [],
      createdBy: data.createdBy,
      archivedBy: data.archivedBy,
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
    if (this.category) {
      payload.category = this.category;
    }
    
    if (this.status) {
      payload.status = this.status;
    }
    
    return payload;
  }
}
