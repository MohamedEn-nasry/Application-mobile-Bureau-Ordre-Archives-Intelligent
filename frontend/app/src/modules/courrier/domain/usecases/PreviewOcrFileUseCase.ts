import { Result } from '../../../../core/utils/result';
import {
    OcrPreviewResultModel,
    SelectedFileModel,
} from '../../data/models/PieceJointeModels';
import { PieceJointeRepository } from '../repositories/PieceJointeRepository';

export class PreviewOcrFileUseCase {
    constructor(private repo: PieceJointeRepository) { }

    async execute(file: SelectedFileModel): Promise<Result<OcrPreviewResultModel>> {
        return await this.repo.previewOcrFile(file);
    }
}