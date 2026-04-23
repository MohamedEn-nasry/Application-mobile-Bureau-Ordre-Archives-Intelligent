import { Result, AsyncResult } from '../../../../core/utils/result';
import { DashboardStats, DashboardActivity } from '../entities/DashboardStats';

/**
 * Dashboard repository interface
 * Defines the contract for dashboard data operations
 */
export interface DashboardRepository {
  /**
   * Get dashboard statistics
   */
  getDashboardStats(): AsyncResult<DashboardStats>;

  /**
   * Get recent activities
   */
  getRecentActivities(limit?: number): AsyncResult<DashboardActivity[]>;

  /**
   * Get archive statistics
   */
  getArchiveStats(): AsyncResult<{
    total: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    expiringSoon: number;
  }>;

  /**
   * Get courrier statistics
   */
  getCourrierStats(): AsyncResult<{
    total: number;
    incoming: number;
    outgoing: number;
    pending: number;
    processed: number;
    urgent: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  }>;

  /**
   * Get document statistics
   */
  getDocumentStats(): AsyncResult<{
    total: number;
    totalSize: number;
    byType: Record<string, number>;
    recentUploads: number;
  }>;

  /**
   * Get user statistics
   */
  getUserStats(): AsyncResult<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
  }>;

  /**
   * Get notification statistics
   */
  getNotificationStats(): AsyncResult<{
    total: number;
    unread: number;
    read: number;
    byType: Record<string, number>;
  }>;

  /**
   * Get activity timeline data
   */
  getActivityTimeline(days: number): AsyncResult<Array<{
    date: string;
    archives: number;
    courriers: number;
    documents: number;
    users: number;
  }>>;

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): AsyncResult<{
    processingEfficiency: number;
    averageProcessingTime: number;
    responseTime: number;
    systemLoad: number;
  }>;

  /**
   * Get quick stats summary
   */
  getQuickStats(): AsyncResult<{
    totalArchives: number;
    totalCourriers: number;
    pendingCourriers: number;
    urgentCourriers: number;
    totalDocuments: number;
    unreadNotifications: number;
    activeUsers: number;
  }>;
}
