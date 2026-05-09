import { AgentOutgoingMail } from '../../domain/entities/AgentOutgoingMail';
import { AgentOutgoingMailResponseModel } from '../models/AgentOutgoingMailResponseModel';

export class AgentOutgoingMailMapper {
    static toDomain(model: AgentOutgoingMailResponseModel): AgentOutgoingMail {
        return new AgentOutgoingMail(
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

    static toDomainList(models: AgentOutgoingMailResponseModel[]): AgentOutgoingMail[] {
        return models.map(this.toDomain);
    }
}