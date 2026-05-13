import { BaseEntity } from '../../../../core/base/BaseEntity';

export class LecteurRecentDocument extends BaseEntity {
    constructor(
        id: string,
        public readonly Reference: string,
        public readonly Objet: string,
        public readonly Source: string,
        public readonly Statut: string,
        public readonly DateCourrier: string,
        public readonly Type: string
    ) {
        super(id);
    }
}

export class LecteurUpdate extends BaseEntity {
    constructor(
        id: string,
        public readonly Title: string,
        public readonly Message: string,
        public readonly DateLabel: string,
        public readonly Type: string
    ) {
        super(id);
    }
}

export class LecteurDashboardOverview {
    constructor(
        public readonly UserFullName: string,
        public readonly UserEmail: string,
        public readonly RoleName: string,

        public readonly IncomingCount: number,
        public readonly OutgoingCount: number,
        public readonly ArchivedCount: number,
        public readonly UnreadNotifications: number,

        public readonly RecentDocuments: LecteurRecentDocument[],
        public readonly RecentUpdates: LecteurUpdate[],

        public readonly LastUpdatedAt: string,
        public readonly WeeklyCourriers: number,
        public readonly WeeklyArchives: number
    ) { }
}