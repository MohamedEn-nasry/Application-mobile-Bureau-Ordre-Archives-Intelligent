import { Result } from '../../../../core/utils/result';
import { LecteurDashboardOverview } from '../entities/LecteurDashboardOverview';
import { LecteurDashboardRepository } from '../repositories/LecteurDashboardRepository';

export class GetLecteurDashboardUseCase {
    constructor(private repository: LecteurDashboardRepository) { }

    async execute(): Promise<Result<LecteurDashboardOverview>> {
        return await this.repository.getOverview();
    }
}