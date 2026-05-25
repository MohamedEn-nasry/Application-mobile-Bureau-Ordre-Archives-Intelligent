import { Result } from '../../../../core/utils/result';
import { CourrierHistoryResponseModel } from '../../data/models/CourrierHistoryResponseModel';

export interface CourrierActionsRepository {
    reassign(params: {
        courrierId: number;
        assigneA: number;
        commentaire?: string | null;
    }): Promise<Result<boolean>>;

    getHistory(courrierId: number): Promise<Result<CourrierHistoryResponseModel[]>>;
}