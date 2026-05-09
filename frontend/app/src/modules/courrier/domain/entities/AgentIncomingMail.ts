import { BaseEntity } from '../../../../core/base/BaseEntity';

export class AgentIncomingMail extends BaseEntity {
    constructor(
        id: string,
        public readonly Reference: string,
        public readonly Type: string,
        public readonly DateCourrier: Date,
        public readonly Expediteur: string | null,
        public readonly Destinataire: string | null,
        public readonly Objet: string,
        public readonly Description: string | null,
        public readonly Statut: string,
        public readonly TexteOcr: string | null,
        public readonly CategorieId: number,
        public readonly AuteurId: number,
        public readonly AssigneA: number | null,
        public readonly CreatedAt: Date,
        public readonly UpdatedAt: Date,
        public readonly DateEcheance: Date | null,
        public readonly PieceJointeCount: number = 0
    ) {
        super(id);
    }
}