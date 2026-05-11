import { Result } from '../../../../core/utils/result';
import { CourrierHistoryResponseModel } from '../../data/models/CourrierHistoryResponseModel';
import { CourrierActionsRepository } from '../repositories/CourrierActionsRepository';

export class GetCourrierHistoryUseCase {
    constructor(private repo: CourrierActionsRepository) { }

    async execute(courrierId: number): Promise<Result<CourrierHistoryResponseModel[]>> {
        return await this.repo.getHistory(courrierId);
    }
}