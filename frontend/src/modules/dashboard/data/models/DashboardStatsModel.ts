import { BaseModelImpl } from '../../../../core/base/BaseModel';

/**
 * Dashboard activity model interface for data layer
 */
export interface DashboardActivityModel {
  id?: string | number;
  type?: string;
  title?: string;
  description?: string;
  timestamp?: string;
  userId?: string | number;
  userName?: string;
  metadata?: Record<string, any>;
}

/**
 * Dashboard stats data model
 * Represents dashboard data from external sources (API, database, etc.)
 */
export interface DashboardStatsModel extends BaseModelImpl {
  id?: string | number;
  totalArchives?: number;
  totalCourriers?: number;
  pendingCourriers?: number;
  urgentCourriers?: number;
  processedCourriers?: number;
  totalDocuments?: number;
  unreadNotifications?: number;
  activeUsers?: number;
  recentActivities?: DashboardActivityModel[];
  archiveStats?: {
    byCategory?: Record<string, number>;
    byStatus?: Record<string, number>;
    expiringSoon?: number;
  };
  courrierStats?: {
    incoming?: number;
    outgoing?: number;
    byStatus?: Record<string, number>;
    byPriority?: Record<string, number>;
  };
  documentStats?: {
    totalSize?: number;
    byType?: Record<string, number>;
    recentUploads?: number;
  };
}

/**
 * Dashboard stats model implementation
 */
export class DashboardStatsModelImpl extends BaseModelImpl implements DashboardStatsModel {
  public id?: string | number;
  public totalArchives?: number;
  public totalCourriers?: number;
  public pendingCourriers?: number;
  public urgentCourriers?: number;
  public processedCourriers?: number;
  public totalDocuments?: number;
  public unreadNotifications?: number;
  public activeUsers?: number;
  public recentActivities?: DashboardActivityModel[];
  public archiveStats?: {
    byCategory?: Record<string, number>;
    byStatus?: Record<string, number>;
    expiringSoon?: number;
  };
  public courrierStats?: {
    incoming?: number;
    outgoing?: number;
    byStatus?: Record<string, number>;
    byPriority?: Record<string, number>;
  };
  public documentStats?: {
    totalSize?: number;
    byType?: Record<string, number>;
    recentUploads?: number;
  };

  /**
   * Validate dashboard stats model structure
   */
  validate(): boolean {
    return !!(this.id);
  }

  /**
   * Create from API response
   */
  static fromAPI(data: any): DashboardStatsModel {
    const model = new DashboardStatsModelImpl();
    Object.assign(model, {
      id: data.id,
      totalArchives: data.totalArchives || 0,
      totalCourriers: data.totalCourriers || 0,
      pendingCourriers: data.pendingCourriers || 0,
      urgentCourriers: data.urgentCourriers || 0,
      processedCourriers: data.processedCourriers || 0,
      totalDocuments: data.totalDocuments || 0,
      unreadNotifications: data.unreadNotifications || 0,
      activeUsers: data.activeUsers || 0,
      recentActivities: data.recentActivities || [],
      archiveStats: data.archiveStats || {
        byCategory: {},
        byStatus: {},
        expiringSoon: 0,
      },
      courrierStats: data.courrierStats || {
        incoming: 0,
        outgoing: 0,
        byStatus: {},
        byPriority: {},
      },
      documentStats: data.documentStats || {
        totalSize: 0,
        byType: {},
        recentUploads: 0,
      },
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
    
    // Ensure nested objects are properly serialized
    if (this.archiveStats) {
      payload.archiveStats = this.archiveStats;
    }
    
    if (this.courrierStats) {
      payload.courrierStats = this.courrierStats;
    }
    
    if (this.documentStats) {
      payload.documentStats = this.documentStats;
    }
    
    if (this.recentActivities) {
      payload.recentActivities = this.recentActivities;
    }
    
    return payload;
  }
}
