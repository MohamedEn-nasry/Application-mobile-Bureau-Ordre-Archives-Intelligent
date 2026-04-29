import { BaseEntity } from '../../../../core/base/BaseEntity';

export interface SummaryStats {
  totalUsers: number;
  totalAgents: number;
  totalLecteurs: number;
  totalReports: number;
  incomingMail: number;
  outgoingMail: number;
  pendingMail: number;
  archivedMail: number;
}

export interface MonthlyStat {
  month: string;
  entrant: number;
  sortant: number;
}

export interface CategoryStat {
  name: string;
  value: number;
}

export interface ChartStats {
  monthlyStats: MonthlyStat[];
  categoryStats: CategoryStat[];
}


export type ActivityIconType = 'mail' | 'archive' | 'user-plus' | 'download' | 'eye';

export class ActivityItem extends BaseEntity {
  constructor(
    id: string,
    public readonly user: string,
    public readonly action: string,
    public readonly time: string,
    public readonly icon: ActivityIconType,
  ) {
    super(id);
  }
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  routeName: string;
  colorScheme: 'blue' | 'indigo' | 'sky' | 'violet' | 'slate' | 'amber';
}
