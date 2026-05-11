import { useState } from 'react';

import {
    ConfirmOcrPayloadModel,
    OcrPreviewResultModel,
    SelectedFileModel,
} from '../../data/models/PieceJointeModels';

import { PieceJointeRemoteDataSource } from '../../data/datasources/PieceJointeRemoteDataSource';
import { PieceJointeRepositoryImpl } from '../../data/repositories/PieceJointeRepositoryImpl';
import { PreviewOcrFileUseCase } from '../../domain/usecases/PreviewOcrFileUseCase';
import { UploadPieceJointeUseCase } from '../../domain/usecases/UploadPieceJointeUseCase';
import { ConfirmPieceJointeOcrUseCase } from '../../domain/usecases/ConfirmPieceJointeOcrUseCase';

const dataSource = new PieceJointeRemoteDataSource();
const repository = new PieceJointeRepositoryImpl(dataSource);

const previewUseCase = new PreviewOcrFileUseCase(repository);
const uploadUseCase = new UploadPieceJointeUseCase(repository);
const confirmUseCase = new ConfirmPieceJointeOcrUseCase(repository);

export interface PendingOcrAttachment {
    file: SelectedFileModel;
    preview: OcrPreviewResultModel;
    confirmedPayload?: ConfirmOcrPayloadModel;
}

export const useCourrierOcrAttachment = () => {
    const [pendingAttachment, setPendingAttachment] =
        useState<PendingOcrAttachment | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const previewOcr = async (file: SelectedFileModel) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await previewUseCase.execute(file);

            if (result.isError()) {
                setError(result.error.message);
                return null;
            }

            const pending: PendingOcrAttachment = {
                file,
                preview: result.value,
            };

            setPendingAttachment(pending);
            return pending;
        } catch (err: any) {
            setError(err.message || 'Erreur OCR');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const setConfirmedOcr = (payload: ConfirmOcrPayloadModel) => {
        setPendingAttachment(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                confirmedPayload: payload,
            };
        });
    };

    const uploadAndConfirmAfterCourrierCreated = async (courrierId: number) => {
        if (!pendingAttachment) return true;

        const uploadResult = await uploadUseCase.execute({
            courrierId,
            file: pendingAttachment.file,
        });

        if (uploadResult.isError()) {
            setError(uploadResult.error.message);
            return false;
        }

        if (pendingAttachment.confirmedPayload) {
            const confirmResult = await confirmUseCase.execute({
                pieceJointeId: uploadResult.value.id,
                payload: pendingAttachment.confirmedPayload,
            });

            if (confirmResult.isError()) {
                setError(confirmResult.error.message);
                return false;
            }
        }

        return true;
    };

    return {
        pendingAttachment,
        setPendingAttachment,
        previewOcr,
        setConfirmedOcr,
        uploadAndConfirmAfterCourrierCreated,
        isLoading,
        error,
    };
};