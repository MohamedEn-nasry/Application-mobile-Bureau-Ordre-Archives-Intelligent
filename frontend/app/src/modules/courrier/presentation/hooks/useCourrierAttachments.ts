import { useCallback, useEffect, useMemo, useState } from 'react';

import { container } from '../../../../core/di/container';
import { PieceJointe } from '../../domain/entities/PieceJointe';
import { PieceJointeImage } from '../../domain/entities/PieceJointeImage';
import { GetCourrierPiecesJointesUseCase } from '../../domain/usecases/GetCourrierPiecesJointesUseCase';
import { GetPieceJointeImageUseCase } from '../../domain/usecases/GetPieceJointeImageUseCase';

export const useCourrierAttachments = (courrierId: number) => {
    const [attachments, setAttachments] = useState<PieceJointe[]>([]);
    const [ocrImage, setOcrImage] = useState<PieceJointeImage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const latestImageAttachment = useMemo(() => {
        return attachments.find(item => item.IsImage);
    }, [attachments]);

    const fetchAttachments = useCallback(async () => {
        if (!courrierId) return;

        setIsLoading(true);
        setError(null);

        try {
            const getPiecesUseCase =
                container.resolve<GetCourrierPiecesJointesUseCase>(
                    'GetCourrierPiecesJointesUseCase'
                );

            const getImageUseCase =
                container.resolve<GetPieceJointeImageUseCase>(
                    'GetPieceJointeImageUseCase'
                );

            const piecesResult = await getPiecesUseCase.execute(courrierId);

            if (piecesResult.isError()) {
                setError(piecesResult.error.message);
                setAttachments([]);
                setOcrImage(null);
                return;
            }

            const pieces = piecesResult.value;
            setAttachments(pieces);

            const latestImage = pieces.find(item => item.IsImage);

            if (!latestImage) {
                setOcrImage(null);
                return;
            }

            const imageResult = await getImageUseCase.execute(Number(latestImage.id));

            if (imageResult.isError()) {
                setError(imageResult.error.message);
                setOcrImage(null);
                return;
            }

            setOcrImage(imageResult.value);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des pièces jointes.');
            setOcrImage(null);
        } finally {
            setIsLoading(false);
        }
    }, [courrierId]);

    useEffect(() => {
        fetchAttachments();
    }, [fetchAttachments]);

    return {
        attachments,
        latestImageAttachment,
        ocrImage,
        isLoading,
        error,
        refetch: fetchAttachments,
    };
};