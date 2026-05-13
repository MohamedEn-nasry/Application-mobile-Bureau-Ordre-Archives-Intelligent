import { PieceJointe } from '../../domain/entities/PieceJointe';
import { PieceJointeImage } from '../../domain/entities/PieceJointeImage';
import {
    PieceJointeImageResponseModel,
    PieceJointeResponseModel,
} from '../models/PieceJointeModels';

export class PieceJointeMapper {
    static toDomain(model: PieceJointeResponseModel): PieceJointe {
        return new PieceJointe(
            String(model.id),
            Number(model.courrierId),
            model.nomFichier,
            model.typeFichier,
            model.cheminFichier,
            model.format,
            Number(model.taille),
            Boolean(model.estScan),
            new Date(model.createdAt)
        );
    }

    static toDomainList(models: PieceJointeResponseModel[]): PieceJointe[] {
        return models.map(model => this.toDomain(model));
    }

    static imageToDomain(model: PieceJointeImageResponseModel): PieceJointeImage {
        return new PieceJointeImage(
            String(model.id),
            model.nomFichier,
            model.typeFichier,
            model.dataUrl
        );
    }
}