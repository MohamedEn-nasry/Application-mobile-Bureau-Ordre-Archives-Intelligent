import { SummaryStats, ActivityItem, QuickAction } from '../../domain/entities/DashboardStats';

// IPA: /rI.pAz.I.tOr.i/ - Repository (pronounced "rep-uh-zi-tor-ee")
// IPA: /dæb.bord/ - Dashboard (pronounced "dab-bord")
// IPA: /In.tEr.feIs/ - Interface (pronounced "in-ter-face")

export interface IDashboardRepository {
  // Get summary statistics for the dashboard
  getSummaryStats(): Promise<SummaryStats>;
  
  // Get recent activity items
  getRecentActivity(): Promise<ActivityItem[]>;
  
  // Get available quick actions for the user
  getQuickActions(): Promise<QuickAction[]>;
  
  // Get assigned mail items for the agent
  getAssignedMail(): Promise<AssignedMailItem[]>;
  
  // Get OCR results
  getOCRResults(): Promise<OCRResult[]>;
}

// Additional entities for Agent dashboard
export interface AssignedMailItem {
  id: string;
  reference: string;
  title: string;
  sender: string;
  status: 'pending' | 'in-progress' | 'completed';
  date: string;
  importance: number; // 1-10 scale
}

export interface OCRResult {
  id: string;
  reference: string;
  title: string;
  completionDate: string;
  content: string;
  confidence: number; // 0-100 percentage
  importance: number; // 1-10 scale
}
