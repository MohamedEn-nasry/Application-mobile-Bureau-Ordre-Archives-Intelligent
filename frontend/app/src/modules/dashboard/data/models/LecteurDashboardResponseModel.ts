export interface LecteurRecentDocumentResponseModel {
    id: number;
    reference: string;
    objet: string;
    source: string;
    statut: string;
    dateCourrier: string;
    type: string;
}

export interface LecteurUpdateResponseModel {
    id: string;
    title: string;
    message: string;
    dateLabel: string;
    type: string;
}

export interface LecteurDashboardResponseModel {
    userFullName: string;
    userEmail: string;
    roleName: string;

    incomingCount: number;
    outgoingCount: number;
    archivedCount: number;
    unreadNotifications: number;

    recentDocuments: LecteurRecentDocumentResponseModel[];
    recentUpdates: LecteurUpdateResponseModel[];

    lastUpdatedAt: string;
    weeklyCourriers: number;
    weeklyArchives: number;
}