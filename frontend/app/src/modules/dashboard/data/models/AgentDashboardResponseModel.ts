export interface AgentDashboardResponseModel {
    userName: string;
    userImage?: string;
    unreadNotifications: number;
    stats: {
        incomingCount: number;
        incomingPending: number;
        outgoingCount: number;
        outgoingDrafts: number;
        pendingTasksCount: number;
        pendingTasksLabel: string;
        recentScansCount: number;
        recentScansLabel: string;
    };
    assignedMails: {
        id: number;
        reference: string;
        objet: string;
        expediteur: string;
        dateCourrier: string;
        statut: string;
    }[];
    recentActivities: {
        id: string;
        title: string;
        timeLabel: string;
        type: string;
    }[];
    recentOcrResults: {
        id: number;
        reference: string;
        title: string;
        excerpt: string;
        confidence: number;
        dateLabel: string;
    }[];


}

