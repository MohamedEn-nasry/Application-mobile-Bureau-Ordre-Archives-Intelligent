import { fail, ok, Result } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';

import { LecteurDashboardOverview } from '../../domain/entities/LecteurDashboardOverview';
import { LecteurDashboardRepository } from '../../domain/repositories/LecteurDashboardRepository';
import { LecteurDashboardRemoteDataSource } from '../datasources/LecteurDashboardRemoteDataSource';
import { LecteurDashboardMapper } from '../mappers/LecteurDashboardMapper';

export class LecteurDashboardRepositoryImpl implements LecteurDashboardRepository {
    constructor(private remoteDataSource: LecteurDashboardRemoteDataSource) { }

    async getOverview(): Promise<Result<LecteurDashboardOverview>> {
        try {
            const response = await this.remoteDataSource.getOverview();
            return ok(LecteurDashboardMapper.toDomain(response));
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }
}