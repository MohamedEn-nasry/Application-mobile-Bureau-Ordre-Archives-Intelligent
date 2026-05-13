import { AgentOcrResult } from '../../domain/entities/AgentOcrResult';
import { AgentOcrResultResponseModel } from '../models/AgentOcrResultResponseModel';

export class AgentOcrResultMapper {
    static toDomain(model: AgentOcrResultResponseModel): AgentOcrResult {
        return new AgentOcrResult(
            String(model.id),
            Number(model.courrierId),
            Number(model.pieceJointeId),
            model.reference,
            model.objet,
            model.type,
            model.texteExtrait,
            Number(model.Confiance ?? 0),
            new Date(model.createdAt)
        );
    }

    static toDomainList(models: AgentOcrResultResponseModel[]): AgentOcrResult[] {
        return models.map(item => this.toDomain(item));
    }
}