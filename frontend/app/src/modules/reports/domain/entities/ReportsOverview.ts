export interface ReportsSummary {
    entrant: number;
    sortant: number;
    enAttente: number;
    archives: number;
  }
  
  export interface MonthlyCourrier {
    label: string;
    entrant: number;
    sortant: number;
  }
  
  export interface CategoryReport {
    name: string;
    count: number;
    percentage: number;
  }
  
  export interface UserActivity {
    label: string;
    count: number;
  }
  
  export interface KeyIndicator {
    label: string;
    value: string;
    delta: string;
    isPositive: boolean;
  }
  
  export interface ReportsOverview {
    summary: ReportsSummary;
    monthlyCourriers: MonthlyCourrier[];
    categoryDistribution: CategoryReport[];
    userActivity: UserActivity[];
    keyIndicators: KeyIndicator[];
  }