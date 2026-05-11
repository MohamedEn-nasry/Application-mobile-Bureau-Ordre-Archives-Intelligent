import { Result } from '../../../../core/utils/result';
import {
    PieceJointeResponseModel,
    SelectedFileModel,
} from '../../data/models/PieceJointeModels';
import { PieceJointeRepository } from '../repositories/PieceJointeRepository';

export class UploadPieceJointeUseCase {
    constructor(private repo: PieceJointeRepository) { }

    async execute(params: {
        courrierId: number;
        file: SelectedFileModel;
    }): Promise<Result<PieceJointeResponseModel>> {
        return await this.repo.upload(params.courrierId, params.file);
    }
}