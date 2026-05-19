import { Result } from '../../../../core/utils/result';
import {
    ConfirmOcrPayloadModel,
    OcrPreviewResultModel,
    PieceJointeResponseModel,
    SelectedFileModel,
} from '../../data/models/PieceJointeModels';

import { PieceJointe } from '../entities/PieceJointe';
import { PieceJointeImage } from '../entities/PieceJointeImage';

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

    getByCourrierId(courrierId: number): Promise<Result<PieceJointe[]>>;
    getImageBase64(id: number): Promise<Result<PieceJointeImage>>;
}