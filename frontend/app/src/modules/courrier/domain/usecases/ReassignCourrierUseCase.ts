import { Result } from '../../../../core/utils/result';
import { CourrierActionsRepository } from '../repositories/CourrierActionsRepository';

export class ReassignCourrierUseCase {
    constructor(private repo: CourrierActionsRepository) { }

    async execute(params: {
        courrierId: number;
        assigneA: number;
        commentaire?: string | null;
    }): Promise<Result<boolean>> {
        return await this.repo.reassign(params);
    }
}