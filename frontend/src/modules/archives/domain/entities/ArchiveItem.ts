import { BaseEntity } from '../../../../core/base/BaseEntity';

/**
 * Archive status enum
 */
export enum ArchiveStatus {
  ACTIVE = 'Active',
  ARCHIVED = 'Archived',
  PENDING = 'Pending',
  EXPIRED = 'Expired',
}

/**
 * Archive category enum
 */
export enum ArchiveCategory {
  FINANCE = 'Finance',
  RH = 'RH',
  TECHNIQUE = 'Technique',
  JURIDIQUE = 'Juridique',
  ADMINISTRATIF = 'Administratif',
  AUTRE = 'Autre',
}

/**
 * Archive item domain entity
 */
export interface ArchiveItem extends BaseEntity {
  readonly title: string;
  readonly description: string;
  readonly category: ArchiveCategory;
  readonly status: ArchiveStatus;
  readonly reference: string;
  readonly archivedDate: Date;
  readonly expiryDate?: Date;
  readonly documentCount: number;
  readonly size: number; // in bytes
  readonly tags: string[];
  readonly createdBy?: string;
  readonly archivedBy?: string;
}

/**
 * Archive item implementation
 */
export class ArchiveItemImpl implements ArchiveItem {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly category: ArchiveCategory,
    public readonly status: ArchiveStatus,
    public readonly reference: string,
    public readonly archivedDate: Date,
    public readonly expiryDate?: Date,
    public readonly documentCount: number = 0,
    public readonly size: number = 0,
    public readonly tags: string[] = [],
    public readonly createdBy?: string,
    public readonly archivedBy?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
  }

  /**
   * Check if archive is expired
   */
  isExpired(): boolean {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
  }

  /**
   * Check if archive is active
   */
  isActive(): boolean {
    return this.status === ArchiveStatus.ACTIVE && !this.isExpired();
  }

  /**
   * Get formatted size
   */
  getFormattedSize(): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.size;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Check if archive has specific tag
   */
  hasTag(tag: string): boolean {
    return this.tags.some(t => t.toLowerCase() === tag.toLowerCase());
  }

  /**
   * Create a copy with updated status
   */
  withStatus(status: ArchiveStatus): ArchiveItem {
    return new ArchiveItemImpl(
      this.id,
      this.title,
      this.description,
      this.category,
      status,
      this.reference,
      this.archivedDate,
      this.expiryDate,
      this.documentCount,
      this.size,
      this.tags,
      this.createdBy,
      this.archivedBy,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Add a tag
   */
  withAddedTag(tag: string): ArchiveItem {
    if (this.hasTag(tag)) return this;
    
    return new ArchiveItemImpl(
      this.id,
      this.title,
      this.description,
      this.category,
      this.status,
      this.reference,
      this.archivedDate,
      this.expiryDate,
      this.documentCount,
      this.size,
      [...this.tags, tag],
      this.createdBy,
      this.archivedBy,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Remove a tag
   */
  withRemovedTag(tag: string): ArchiveItem {
    const filteredTags = this.tags.filter(t => t.toLowerCase() !== tag.toLowerCase());
    
    return new ArchiveItemImpl(
      this.id,
      this.title,
      this.description,
      this.category,
      this.status,
      this.reference,
      this.archivedDate,
      this.expiryDate,
      this.documentCount,
      this.size,
      filteredTags,
      this.createdBy,
      this.archivedBy,
      this.createdAt,
      new Date()
    );
  }
}
