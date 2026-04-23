import { BaseEntity } from '../../../../core/base/BaseEntity';

/**
 * Dashboard statistics entity
 */
export interface DashboardStats extends BaseEntity {
  readonly totalArchives: number;
  readonly totalCourriers: number;
  readonly pendingCourriers: number;
  readonly urgentCourriers: number;
  readonly processedCourriers: number;
  readonly totalDocuments: number;
  readonly unreadNotifications: number;
  readonly activeUsers: number;
  readonly recentActivities: DashboardActivity[];
  readonly archiveStats: {
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    expiringSoon: number;
  };
  readonly courrierStats: {
    incoming: number;
    outgoing: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
  readonly documentStats: {
    totalSize: number;
    byType: Record<string, number>;
    recentUploads: number;
  };
}

/**
 * Dashboard activity interface
 */
export interface DashboardActivity {
  readonly id: string;
  readonly type: 'archive' | 'courrier' | 'document' | 'user' | 'system';
  readonly title: string;
  readonly description: string;
  readonly timestamp: Date;
  readonly userId?: string;
  readonly userName?: string;
  readonly metadata?: Record<string, any>;
}

/**
 * Chart data point interface
 */
export interface ChartDataPoint {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
}

/**
 * Time series data point interface
 */
export interface TimeSeriesDataPoint {
  readonly date: string;
  readonly value: number;
  readonly label?: string;
}

/**
 * Dashboard statistics implementation
 */
export class DashboardStatsImpl implements DashboardStats {
  constructor(
    public readonly id: string,
    public readonly totalArchives: number,
    public readonly totalCourriers: number,
    public readonly pendingCourriers: number,
    public readonly urgentCourriers: number,
    public readonly processedCourriers: number,
    public readonly totalDocuments: number,
    public readonly unreadNotifications: number,
    public readonly activeUsers: number,
    public readonly recentActivities: DashboardActivity[],
    public readonly archiveStats: {
      byCategory: Record<string, number>;
      byStatus: Record<string, number>;
      expiringSoon: number;
    },
    public readonly courrierStats: {
      incoming: number;
      outgoing: number;
      byStatus: Record<string, number>;
      byPriority: Record<string, number>;
    },
    public readonly documentStats: {
      totalSize: number;
      byType: Record<string, number>;
      recentUploads: number;
    },
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Get total pending items (courriers + notifications)
   */
  getTotalPending(): number {
    return this.pendingCourriers + this.unreadNotifications;
  }

  /**
   * Get processing efficiency percentage
   */
  getProcessingEfficiency(): number {
    if (this.totalCourriers === 0) return 0;
    return Math.round((this.processedCourriers / this.totalCourriers) * 100);
  }

  /**
   * Get urgent items percentage
   */
  getUrgentPercentage(): number {
    if (this.totalCourriers === 0) return 0;
    return Math.round((this.urgentCourriers / this.totalCourriers) * 100);
  }

  /**
   * Get activity summary
   */
  getActivitySummary(): {
    today: number;
    thisWeek: number;
    thisMonth: number;
  } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      today: this.recentActivities.filter(activity => activity.timestamp >= today).length,
      thisWeek: this.recentActivities.filter(activity => activity.timestamp >= weekStart).length,
      thisMonth: this.recentActivities.filter(activity => activity.timestamp >= monthStart).length,
    };
  }

  /**
   * Get archive category chart data
   */
  getArchiveCategoryChartData(): ChartDataPoint[] {
    return Object.entries(this.archiveStats.byCategory).map(([category, count]) => ({
      label: category,
      value: count,
      color: getCategoryColor(category),
    }));
  }

  /**
   * Get courrier status chart data
   */
  getCourrierStatusChartData(): ChartDataPoint[] {
    return Object.entries(this.courrierStats.byStatus).map(([status, count]) => ({
      label: status,
      value: count,
      color: getStatusColor(status),
    }));
  }

  /**
   * Get document type chart data
   */
  getDocumentTypeChartData(): ChartDataPoint[] {
    return Object.entries(this.documentStats.byType).map(([type, count]) => ({
      label: type,
      value: count,
      color: getDocumentTypeColor(type),
    }));
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let fileSize = bytes;
    let unitIndex = 0;
    
    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }
    
    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Get formatted document size
   */
  getFormattedDocumentSize(): string {
    return this.formatFileSize(this.documentStats.totalSize);
  }

  /**
   * Check if there are urgent items requiring attention
   */
  hasUrgentItems(): boolean {
    return this.urgentCourriers > 0 || this.archiveStats.expiringSoon > 0;
  }

  /**
   * Get priority level based on stats
   */
  getPriorityLevel(): 'low' | 'medium' | 'high' | 'critical' {
    if (this.urgentCourriers > 10 || this.pendingCourriers > 50 || this.archiveStats.expiringSoon > 20) {
      return 'critical';
    }
    if (this.urgentCourriers > 5 || this.pendingCourriers > 25 || this.archiveStats.expiringSoon > 10) {
      return 'high';
    }
    if (this.urgentCourriers > 0 || this.pendingCourriers > 10 || this.archiveStats.expiringSoon > 5) {
      return 'medium';
    }
    return 'low';
  }
}

/**
 * Helper function to get category color
 */
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Finance': '#FF6B6B',
    'RH': '#4ECDC4',
    'Technique': '#45B7D1',
    'Juridique': '#96CEB4',
    'Administratif': '#FFEAA7',
    'Autre': '#DFE6E9',
  };
  return colors[category] || '#95A5A6';
}

/**
 * Helper function to get status color
 */
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Pending': '#FFA500',
    'Processed': '#00FF00',
    'Urgent': '#FF0000',
    'Archived': '#808080',
    'Sent': '#0000FF',
    'Active': '#00FF00',
    'Inactive': '#FF0000',
  };
  return colors[status] || '#95A5A6';
}

/**
 * Helper function to get document type color
 */
function getDocumentTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'PDF': '#FF0000',
    'Word': '#2B579A',
    'Excel': '#217346',
    'PowerPoint': '#D24726',
    'Image': '#FFA500',
    'Text': '#666666',
    'Other': '#95A5A6',
  };
  return colors[type] || '#95A5A6';
}
