import { Result } from '../../../../core/utils/result';
import { PieceJointeImage } from '../entities/PieceJointeImage';
import { PieceJointeRepository } from '../repositories/PieceJointeRepository';

export class GetPieceJointeImageUseCase {
    constructor(private repository: PieceJointeRepository) { }

    async execute(pieceJointeId: number): Promise<Result<PieceJointeImage>> {
        return await this.repository.getImageBase64(pieceJointeId);
    }
}