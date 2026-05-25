import { ok, fail, Result } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { SuperAgentDashboardRepository } from '../../domain/repositories/SuperAgentDashboardRepository';
import { AgentDashboard } from '../../domain/entities/AgentDashboard';
import { SuperAgentDashboardRemoteDataSource } from '../datasources/SuperAgentDashboardRemoteDataSource';
import { AgentOcrResult } from '../../domain/entities/AgentOcrResult';
import { AgentOcrResultMapper } from '../mappers/AgentOcrResultMapper';

export class SuperAgentDashboardRepositoryImpl implements SuperAgentDashboardRepository {
    constructor(
        private remoteDataSource: SuperAgentDashboardRemoteDataSource
    ) { }

    async getOverview(): Promise<Result<AgentDashboard>> {
        try {
            const response = await this.remoteDataSource.getOverview();

            return ok({
                userName: response.userName,
                userImage: response.userImage,
                unreadNotifications: response.unreadNotifications,
                stats: response.stats,
                assignedMails: response.assignedMails,
                recentActivities: response.recentActivities,
                recentOcrResults: response.recentOcrResults,
            });
        } catch (error: any) {
            return fail(new ServerFailure(error.message || 'Error fetching super agent dashboard overview'));
        }
    }

    async getOcrResults(): Promise<Result<AgentOcrResult[]>> {
        try {
            const models = await this.remoteDataSource.getOcrResults();
            const domainItems = AgentOcrResultMapper.toDomainList(models);

            return ok(domainItems);
        } catch (error: any) {
            return fail(new ServerFailure(error.message || 'Error fetching super agent OCR results'));
        }
    }
}
