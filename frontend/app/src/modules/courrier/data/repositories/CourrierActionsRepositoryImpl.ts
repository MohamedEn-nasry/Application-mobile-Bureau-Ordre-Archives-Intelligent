import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { CourrierActionsRepository } from '../../domain/repositories/CourrierActionsRepository';
import { CourrierActionsRemoteDataSource } from '../datasources/CourrierActionsRemoteDataSource';
import { CourrierHistoryResponseModel } from '../models/CourrierHistoryResponseModel';

export class CourrierActionsRepositoryImpl implements CourrierActionsRepository {
    constructor(private remoteDataSource: CourrierActionsRemoteDataSource) { }

    async reassign(params: {
        courrierId: number;
        assigneA: number;
        commentaire?: string | null;
    }): Promise<Result<boolean>> {
        try {
            const result = await this.remoteDataSource.reassign(params.courrierId, {
                assigneA: params.assigneA,
                commentaire: params.commentaire ?? null,
            });

            return ok(result);
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }

    async getHistory(
        courrierId: number
    ): Promise<Result<CourrierHistoryResponseModel[]>> {
        try {
            const result = await this.remoteDataSource.getHistory(courrierId);
            return ok(result);
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }
}