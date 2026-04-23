import { success, failure, AsyncResult } from '../../../../core/utils/result';
import { NetworkFailure } from '../../../../core/error/failures';
import { ApiClient } from '../../../../core/network/apiClient';
import { DashboardRepository } from '../../domain/repositories/DashboardRepository';
import { DashboardActivity, DashboardStats } from '../../domain/entities/DashboardStats';
import { DashboardMapper } from '../mappers/DashboardMapper';
import { DashboardStatsModelImpl } from '../models/DashboardStatsModel';

/**
 * Dashboard remote data source
 * Handles all remote API calls for dashboard data
 */
export class DashboardRemoteDataSource {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly dashboardMapper: DashboardMapper
  ) {}

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): AsyncResult<DashboardStats> {
    try {
      const response = await this.apiClient.get('/dashboard/stats');

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      const dashboardModel = DashboardStatsModelImpl.fromAPI(data);
      const dashboard = this.dashboardMapper.toDomain(dashboardModel);

      return success(dashboard);

    } catch (error) {
      return failure(new NetworkFailure('Get dashboard stats failed', undefined, error as Error));
    }
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit?: number): AsyncResult<DashboardActivity[]> {
    try {
      const params = limit ? { limit } : {};
      const response = await this.apiClient.get('/dashboard/activities', params);

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data as any[];
      const activities = data.map((activityData: any) => ({
        id: activityData.id?.toString() || '',
        type: this.mapActivityType(activityData.type),
        title: activityData.title || '',
        description: activityData.description || '',
        timestamp: activityData.timestamp ? new Date(activityData.timestamp) : new Date(),
        userId: activityData.userId?.toString(),
        userName: activityData.userName,
        metadata: activityData.metadata,
      }));

      return success(activities);

    } catch (error) {
      return failure(new NetworkFailure('Get recent activities failed', undefined, error as Error));
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
      const response = await this.apiClient.get('/dashboard/archives/stats');

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data as any;
      return success({
        total: data.total || 0,
        byCategory: data.byCategory || {},
        byStatus: data.byStatus || {},
        expiringSoon: data.expiringSoon || 0,
      });

    } catch (error) {
      return failure(new NetworkFailure('Get archive stats failed', undefined, error as Error));
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
      const response = await this.apiClient.get('/dashboard/courriers/stats');

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      return success({
        total: data.total || 0,
        incoming: data.incoming || 0,
        outgoing: data.outgoing || 0,
        pending: data.pending || 0,
        processed: data.processed || 0,
        urgent: data.urgent || 0,
        byStatus: data.byStatus || {},
        byPriority: data.byPriority || {},
      });

    } catch (error) {
      return failure(new NetworkFailure('Get courrier stats failed', undefined, error as Error));
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
      const response = await this.apiClient.get('/dashboard/documents/stats');

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      return success({
        total: data.total || 0,
        totalSize: data.totalSize || 0,
        byType: data.byType || {},
        recentUploads: data.recentUploads || 0,
      });

    } catch (error) {
      return failure(new NetworkFailure('Get document stats failed', undefined, error as Error));
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
      const response = await this.apiClient.get('/dashboard/users/stats');

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      return success({
        total: data.total || 0,
        active: data.active || 0,
        inactive: data.inactive || 0,
        byRole: data.byRole || {},
      });

    } catch (error) {
      return failure(new NetworkFailure('Get user stats failed', undefined, error as Error));
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
      const response = await this.apiClient.get('/dashboard/notifications/stats');

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      return success({
        total: data.total || 0,
        unread: data.unread || 0,
        read: data.read || 0,
        byType: data.byType || {},
      });

    } catch (error) {
      return failure(new NetworkFailure('Get notification stats failed', undefined, error as Error));
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
      const response = await this.apiClient.get('/dashboard/timeline', { days });

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      return success(data.map((item: any) => ({
        date: item.date,
        archives: item.archives || 0,
        courriers: item.courriers || 0,
        documents: item.documents || 0,
        users: item.users || 0,
      })));

    } catch (error) {
      return failure(new NetworkFailure('Get activity timeline failed', undefined, error as Error));
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
      const response = await this.apiClient.get('/dashboard/performance');

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      return success({
        processingEfficiency: data.processingEfficiency || 0,
        averageProcessingTime: data.averageProcessingTime || 0,
        responseTime: data.responseTime || 0,
        systemLoad: data.systemLoad || 0,
      });

    } catch (error) {
      return failure(new NetworkFailure('Get performance metrics failed', undefined, error as Error));
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
      const response = await this.apiClient.get('/dashboard/quick-stats');

      if (response.isFailure()) {
        return failure(response.error);
      }

      const data = response.value.data;
      return success({
        totalArchives: data.totalArchives || 0,
        totalCourriers: data.totalCourriers || 0,
        pendingCourriers: data.pendingCourriers || 0,
        urgentCourriers: data.urgentCourriers || 0,
        totalDocuments: data.totalDocuments || 0,
        unreadNotifications: data.unreadNotifications || 0,
        activeUsers: data.activeUsers || 0,
      });

    } catch (error) {
      return failure(new NetworkFailure('Get quick stats failed', undefined, error as Error));
    }
  }

  /**
   * Map activity type from API to domain
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
