import { AgentIncomingMail } from '../../domain/entities/AgentIncomingMail';
import { AgentIncomingMailResponseModel } from '../models/AgentIncomingMailResponseModel';

export class AgentIncomingMailMapper {
    static toDomain(model: AgentIncomingMailResponseModel): AgentIncomingMail {
        return new AgentIncomingMail(
            model.id.toString(),
            model.reference,
            model.type,
            new Date(model.dateCourrier),
            model.expediteur ?? null,
            model.destinataire ?? null,
            model.objet,
            model.description ?? null,
            model.statut,
            model.texteOcr ?? null,
            model.categorieId,
            model.auteurId,
            model.assigneA ?? null,
            new Date(model.createdAt),
            new Date(model.updatedAt),
            model.dateEcheance ? new Date(model.dateEcheance) : null,
            model.pieceJointeCount ?? 0
        );
    }

    static toDomainList(models: AgentIncomingMailResponseModel[]): AgentIncomingMail[] {
        return models.map(this.toDomain);
    }
}