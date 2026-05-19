import { Result } from '../../../../core/utils/result';
import { ConfirmOcrPayloadModel } from '../../data/models/PieceJointeModels';
import { PieceJointeRepository } from '../repositories/PieceJointeRepository';

export class ConfirmPieceJointeOcrUseCase {
    constructor(private repo: PieceJointeRepository) { }

    async execute(params: {
        pieceJointeId: number;
        payload: ConfirmOcrPayloadModel;
    }): Promise<Result<boolean>> {
        return await this.repo.confirmOcr(params.pieceJointeId, params.payload);
    }
}