import {
    LecteurDashboardOverview,
    LecteurRecentDocument,
    LecteurUpdate,
} from '../../domain/entities/LecteurDashboardOverview';

import { LecteurDashboardResponseModel } from '../models/LecteurDashboardResponseModel';

export class LecteurDashboardMapper {
    static toDomain(model: LecteurDashboardResponseModel): LecteurDashboardOverview {
        return new LecteurDashboardOverview(
            model.userFullName,
            model.userEmail,
            model.roleName,

            Number(model.incomingCount ?? 0),
            Number(model.outgoingCount ?? 0),
            Number(model.archivedCount ?? 0),
            Number(model.unreadNotifications ?? 0),

            (model.recentDocuments ?? []).map(
                item =>
                    new LecteurRecentDocument(
                        String(item.id),
                        item.reference,
                        item.objet,
                        item.source,
                        item.statut,
                        item.dateCourrier,
                        item.type
                    )
            ),

            (model.recentUpdates ?? []).map(
                item =>
                    new LecteurUpdate(
                        item.id,
                        item.title,
                        item.message,
                        item.dateLabel,
                        item.type
                    )
            ),

            model.lastUpdatedAt,
            Number(model.weeklyCourriers ?? 0),
            Number(model.weeklyArchives ?? 0)
        );
    }
}