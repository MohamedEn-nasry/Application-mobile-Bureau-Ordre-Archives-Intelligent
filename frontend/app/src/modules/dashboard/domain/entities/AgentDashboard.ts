export interface AgentDashboardStats {
    incomingCount: number;
    incomingPending: number;
    outgoingCount: number;
    outgoingDrafts: number;
    pendingTasksCount: number;
    pendingTasksLabel: string;
    recentScansCount: number;
    recentScansLabel: string;
}

export interface AssignedMailItem {
    id: number;
    reference: string;
    objet: string;
    expediteur: string;
    dateCourrier: string;
    statut: string;
}

export interface RecentActivityItem {
    id: string;
    title: string;
    timeLabel: string;
    type: string;
}

export interface RecentOcrResultItem {
    id: number;
    reference: string;
    title: string;
    excerpt: string;
    confidence: number;
    dateLabel: string;
}

export interface AgentDashboard {
    userName: string;
    userImage?: string;
    unreadNotifications: number;
    stats: AgentDashboardStats;
    assignedMails: AssignedMailItem[];
    recentActivities: RecentActivityItem[];
    recentOcrResults: RecentOcrResultItem[];
}