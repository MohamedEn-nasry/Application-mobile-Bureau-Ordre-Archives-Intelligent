import { Result } from '../../../../core/utils/result';
import { PieceJointe } from '../entities/PieceJointe';
import { PieceJointeRepository } from '../repositories/PieceJointeRepository';

export class GetCourrierPiecesJointesUseCase {
    constructor(private repository: PieceJointeRepository) { }

    async execute(courrierId: number): Promise<Result<PieceJointe[]>> {
        return await this.repository.getByCourrierId(courrierId);
    }
}