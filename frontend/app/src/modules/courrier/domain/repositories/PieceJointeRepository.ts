import { Result } from '../../../../core/utils/result';
import {
    ConfirmOcrPayloadModel,
    OcrPreviewResultModel,
    PieceJointeResponseModel,
    SelectedFileModel,
} from '../../data/models/PieceJointeModels';

export interface PieceJointeRepository {
    previewOcrFile(file: SelectedFileModel): Promise<Result<OcrPreviewResultModel>>;

    upload(
        courrierId: number,
        file: SelectedFileModel
    ): Promise<Result<PieceJointeResponseModel>>;

    confirmOcr(
        pieceJointeId: number,
        payload: ConfirmOcrPayloadModel
    ): Promise<Result<boolean>>;
}