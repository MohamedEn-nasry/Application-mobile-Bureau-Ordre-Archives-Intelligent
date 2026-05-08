import { ok, fail, Result } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { AgentDashboardRepository } from '../../domain/repositories/AgentDashboardRepository';
import { AgentDashboard } from '../../domain/entities/AgentDashboard';
import { AgentDashboardRemoteDataSource } from '../datasources/AgentDashboardRemoteDataSource';

export class AgentDashboardRepositoryImpl implements AgentDashboardRepository {
    constructor(
        private remoteDataSource: AgentDashboardRemoteDataSource
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
            return fail(new ServerFailure(error.message));
        }
    }
}