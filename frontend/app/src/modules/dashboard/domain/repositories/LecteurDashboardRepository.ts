import { Result } from '../../../../core/utils/result';
import { LecteurDashboardOverview } from '../entities/LecteurDashboardOverview';

export interface LecteurDashboardRepository {
    getOverview(): Promise<Result<LecteurDashboardOverview>>;
}