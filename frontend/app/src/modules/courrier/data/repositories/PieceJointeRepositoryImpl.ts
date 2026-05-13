import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';

import { PieceJointeRepository } from '../../domain/repositories/PieceJointeRepository';
import { PieceJointeRemoteDataSource } from '../datasources/PieceJointeRemoteDataSource';
import {
    ConfirmOcrPayloadModel,
    OcrPreviewResultModel,
    PieceJointeResponseModel,
    SelectedFileModel,
} from '../models/PieceJointeModels';
import { PieceJointe } from '../../domain/entities/PieceJointe';
import { PieceJointeImage } from '../../domain/entities/PieceJointeImage';
import { PieceJointeMapper } from '../mappers/PieceJointeMapper';

export class PieceJointeRepositoryImpl implements PieceJointeRepository {
    constructor(private remoteDataSource: PieceJointeRemoteDataSource) { }

    async previewOcrFile(
        file: SelectedFileModel
    ): Promise<Result<OcrPreviewResultModel>> {
        try {
            const response = await this.remoteDataSource.previewOcrFile(file);
            return ok(response);
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }

    async upload(
        courrierId: number,
        file: SelectedFileModel
    ): Promise<Result<PieceJointeResponseModel>> {
        try {
            const response = await this.remoteDataSource.upload(courrierId, file);
            return ok(response);
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }

    async confirmOcr(
        pieceJointeId: number,
        payload: ConfirmOcrPayloadModel
    ): Promise<Result<boolean>> {
        try {
            const response = await this.remoteDataSource.confirmOcr(
                pieceJointeId,
                payload
            );

            return ok(response);
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }

    async getByCourrierId(courrierId: number): Promise<Result<PieceJointe[]>> {
        try {
            const response = await this.remoteDataSource.getByCourrierId(courrierId);
            return ok(PieceJointeMapper.toDomainList(response));
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }

    async getImageBase64(id: number): Promise<Result<PieceJointeImage>> {
        try {
            const response = await this.remoteDataSource.getImageBase64(id);
            return ok(PieceJointeMapper.imageToDomain(response));
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }
}