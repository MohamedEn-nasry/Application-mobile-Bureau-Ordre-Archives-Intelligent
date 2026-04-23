import { BaseMapper } from '../../../../core/utils/mapper';
import { DashboardStats, DashboardStatsImpl, DashboardActivity } from '../../domain/entities/DashboardStats';
import { DashboardStatsModel, DashboardStatsModelImpl, DashboardActivityModel } from '../models/DashboardStatsModel';

/**
 * Mapper for transforming between DashboardStats domain entities and DashboardStatsModel data models
 */
export class DashboardMapper extends BaseMapper<DashboardStatsModel, DashboardStats> {
  /**
   * Convert DashboardStatsModel to DashboardStats domain entity
   */
  toDomain(from: DashboardStatsModel): DashboardStats {
    if (!from.id) {
      throw new Error('DashboardStatsModel must have an ID to convert to domain entity');
    }

    return new DashboardStatsImpl(
      from.id.toString(),
      from.totalArchives || 0,
      from.totalCourriers || 0,
      from.pendingCourriers || 0,
      from.urgentCourriers || 0,
      from.processedCourriers || 0,
      from.totalDocuments || 0,
      from.unreadNotifications || 0,
      from.activeUsers || 0,
      this.mapActivities(from.recentActivities || []),
      {
        byCategory: from.archiveStats?.byCategory || {},
        byStatus: from.archiveStats?.byStatus || {},
        expiringSoon: from.archiveStats?.expiringSoon || 0,
      },
      {
        incoming: from.courrierStats?.incoming || 0,
        outgoing: from.courrierStats?.outgoing || 0,
        byStatus: from.courrierStats?.byStatus || {},
        byPriority: from.courrierStats?.byPriority || {},
      },
      {
        totalSize: from.documentStats?.totalSize || 0,
        byType: from.documentStats?.byType || {},
        recentUploads: from.documentStats?.recentUploads || 0,
      },
      from.created_at ? new Date(from.created_at) : new Date(),
      from.updated_at ? new Date(from.updated_at) : new Date()
    );
  }

  /**
   * Convert DashboardStats domain entity to DashboardStatsModel
   */
  fromDomain(to: DashboardStats): DashboardStatsModel {
    const model = new DashboardStatsModelImpl();
    model.id = to.id;
    model.totalArchives = to.totalArchives;
    model.totalCourriers = to.totalCourriers;
    model.pendingCourriers = to.pendingCourriers;
    model.urgentCourriers = to.urgentCourriers;
    model.processedCourriers = to.processedCourriers;
    model.totalDocuments = to.totalDocuments;
    model.unreadNotifications = to.unreadNotifications;
    model.activeUsers = to.activeUsers;
    model.recentActivities = this.mapActivitiesToModel(to.recentActivities);
    model.archiveStats = {
      byCategory: to.archiveStats.byCategory,
      byStatus: to.archiveStats.byStatus,
      expiringSoon: to.archiveStats.expiringSoon,
    };
    model.courrierStats = {
      incoming: to.courrierStats.incoming,
      outgoing: to.courrierStats.outgoing,
      byStatus: to.courrierStats.byStatus,
      byPriority: to.courrierStats.byPriority,
    };
    model.documentStats = {
      totalSize: to.documentStats.totalSize,
      byType: to.documentStats.byType,
      recentUploads: to.documentStats.recentUploads,
    };
    model.created_at = to.createdAt.toISOString();
    model.updated_at = to.updatedAt.toISOString();
    
    return model;
  }

  /**
   * Map activities from model to domain
   */
  private mapActivities(activities: DashboardActivityModel[]): DashboardActivity[] {
    return activities.map(activity => ({
      id: activity.id?.toString() || '',
      type: this.mapActivityType(activity.type),
      title: activity.title || '',
      description: activity.description || '',
      timestamp: activity.timestamp ? new Date(activity.timestamp) : new Date(),
      userId: activity.userId?.toString(),
      userName: activity.userName,
      metadata: activity.metadata,
    }));
  }

  /**
   * Map activities from domain to model
   */
  private mapActivitiesToModel(activities: DashboardActivity[]): DashboardActivityModel[] {
    return activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      timestamp: activity.timestamp.toISOString(),
      userId: activity.userId,
      userName: activity.userName,
      metadata: activity.metadata,
    }));
  }

  /**
   * Map activity type from model to domain
   */
  private mapActivityType(type?: string): 'archive' | 'courrier' | 'document' | 'user' | 'system' {
    switch (type) {
      case 'archive':
        return 'archive';
      case 'courrier':
        return 'courrier';
      case 'document':
        return 'document';
      case 'user':
        return 'user';
      case 'system':
        return 'system';
      default:
        return 'system'; // Default fallback
    }
  }
}
