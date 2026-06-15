import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';

import {
    ConfirmOcrPayloadModel,
    OcrPreviewResultModel,
    PieceJointeResponseModel,
    SelectedFileModel,

    PieceJointeImageResponseModel,
} from '../models/PieceJointeModels';

export class PieceJointeRemoteDataSource {
    async previewOcrFile(file: SelectedFileModel): Promise<OcrPreviewResultModel> {
        const formData = new FormData();

        appendFileToFormData(formData, 'file', file);

        return await apiClient.postFormData<OcrPreviewResultModel>(
            endpoints.piecesJointes.ocrPreviewFile,
            formData
        );
    }

    async upload(
        courrierId: number,
        file: SelectedFileModel
    ): Promise<PieceJointeResponseModel> {
        const formData = new FormData();

        appendFileToFormData(formData, 'file', file);

        return await apiClient.postFormData<PieceJointeResponseModel>(
            endpoints.piecesJointes.upload(courrierId),
            formData
        );
    }

    async confirmOcr(
        pieceJointeId: number,
        payload: ConfirmOcrPayloadModel
    ): Promise<boolean> {
        await apiClient.post<any>(
            endpoints.piecesJointes.ocrConfirm(pieceJointeId),
            payload
        );

        return true;
    }

    async getByCourrierId(
        courrierId: number
    ): Promise<PieceJointeResponseModel[]> {
        return await apiClient.get<PieceJointeResponseModel[]>(
            endpoints.piecesJointes.getByCourrierId(courrierId)
        );
    }

    async getImageBase64(id: number): Promise<PieceJointeImageResponseModel> {
        return await apiClient.get<PieceJointeImageResponseModel>(
            endpoints.piecesJointes.imageBase64(id)
        );
    }
}

const appendFileToFormData = (
    formData: FormData,
    fieldName: string,
    file: SelectedFileModel
) => {
    if (file.file) {
        // Web
        formData.append(fieldName, file.file, file.name);
        return;
    }

    // Mobile
    formData.append(fieldName, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
    } as any);
};

