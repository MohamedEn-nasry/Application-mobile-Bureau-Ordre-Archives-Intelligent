import { IDashboardRepository, AssignedMailItem, OCRResult } from '../../data/repositories/IDashboardRepository';
import { SummaryStats, ActivityItem, QuickAction } from '../entities/DashboardStats';

// IPA: /ju:s keIs/ - Use Case (pronounced "yoos case")
// IPA: /dæb.bord deI.teI/ - Dashboard Data (pronounced "dab-bord day-ta")
// IPA: /get/ - Get (pronounced "get")

export interface DashboardData {
  summaryStats: SummaryStats;
  recentActivity: ActivityItem[];
  quickActions: QuickAction[];
  assignedMail: AssignedMailItem[];
  ocrResults: OCRResult[];
}

export class GetDashboardDataUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(): Promise<DashboardData> {
    try {
      // Execute all data fetching operations in parallel for better performance
      const [
        summaryStats,
        recentActivity,
        quickActions,
        assignedMail,
        ocrResults
      ] = await Promise.all([
        this.repository.getSummaryStats(),
        this.repository.getRecentActivity(),
        this.repository.getQuickActions(),
        this.repository.getAssignedMail(),
        this.repository.getOCRResults()
      ]);

      return {
        summaryStats,
        recentActivity,
        quickActions,
        assignedMail,
        ocrResults
      };
    } catch (error) {
      console.error('Error in GetDashboardDataUseCase:', error);
      throw error;
    }
  }
}
