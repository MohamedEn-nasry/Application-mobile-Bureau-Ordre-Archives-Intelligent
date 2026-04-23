import { success, failure, AsyncResult } from '../../../../core/utils/result';
import { DashboardRepository } from '../../domain/repositories/DashboardRepository';
import { DashboardActivity, DashboardStats } from '../../domain/entities/DashboardStats';
import { DashboardRemoteDataSource } from '../datasources/DashboardRemoteDataSource';
import { BusinessLogicFailure } from '../../../../core/error/failures';

/**
 * Dashboard repository implementation
 * Implements the DashboardRepository interface using remote data source
 */
export class DashboardRepositoryImpl implements DashboardRepository {
  constructor(private readonly remoteDataSource: DashboardRemoteDataSource) {}

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): AsyncResult<DashboardStats> {
    try {
      const result = await this.remoteDataSource.getDashboardStats();
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get dashboard stats', 'GET_DASHBOARD_STATS_ERROR')
      );
    }
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit?: number): AsyncResult<DashboardActivity[]> {
    try {
      const result = await this.remoteDataSource.getRecentActivities(limit);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get recent activities', 'GET_RECENT_ACTIVITIES_ERROR')
      );
    }
  }

  /**
   * Get archive statistics
   */
  async getArchiveStats(): AsyncResult<{
    total: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    expiringSoon: number;
  }> {
    try {
      const result = await this.remoteDataSource.getArchiveStats();
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get archive stats', 'GET_ARCHIVE_STATS_ERROR')
      );
    }
  }

  /**
   * Get courrier statistics
   */
  async getCourrierStats(): AsyncResult<{
    total: number;
    incoming: number;
    outgoing: number;
    pending: number;
    processed: number;
    urgent: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    try {
      const result = await this.remoteDataSource.getCourrierStats();
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get courrier stats', 'GET_COURRIER_STATS_ERROR')
      );
    }
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(): AsyncResult<{
    total: number;
    totalSize: number;
    byType: Record<string, number>;
    recentUploads: number;
  }> {
    try {
      const result = await this.remoteDataSource.getDocumentStats();
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get document stats', 'GET_DOCUMENT_STATS_ERROR')
      );
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): AsyncResult<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
  }> {
    try {
      const result = await this.remoteDataSource.getUserStats();
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get user stats', 'GET_USER_STATS_ERROR')
      );
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(): AsyncResult<{
    total: number;
    unread: number;
    read: number;
    byType: Record<string, number>;
  }> {
    try {
      const result = await this.remoteDataSource.getNotificationStats();
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get notification stats', 'GET_NOTIFICATION_STATS_ERROR')
      );
    }
  }

  /**
   * Get activity timeline data
   */
  async getActivityTimeline(days: number): AsyncResult<Array<{
    date: string;
    archives: number;
    courriers: number;
    documents: number;
    users: number;
  }>> {
    try {
      const result = await this.remoteDataSource.getActivityTimeline(days);
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get activity timeline', 'GET_ACTIVITY_TIMELINE_ERROR')
      );
    }
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(): AsyncResult<{
    processingEfficiency: number;
    averageProcessingTime: number;
    responseTime: number;
    systemLoad: number;
  }> {
    try {
      const result = await this.remoteDataSource.getPerformanceMetrics();
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get performance metrics', 'GET_PERFORMANCE_METRICS_ERROR')
      );
    }
  }

  /**
   * Get quick stats summary
   */
  async getQuickStats(): AsyncResult<{
    totalArchives: number;
    totalCourriers: number;
    pendingCourriers: number;
    urgentCourriers: number;
    totalDocuments: number;
    unreadNotifications: number;
    activeUsers: number;
  }> {
    try {
      const result = await this.remoteDataSource.getQuickStats();
      return result;
    } catch (error) {
      return failure(
        new BusinessLogicFailure('Failed to get quick stats', 'GET_QUICK_STATS_ERROR')
      );
    }
  }
}
