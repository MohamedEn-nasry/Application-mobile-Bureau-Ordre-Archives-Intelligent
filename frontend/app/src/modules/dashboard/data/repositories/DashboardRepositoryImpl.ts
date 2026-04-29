import { IDashboardRepository } from '../../domain/repositories/IDashboardRepository';
import { SummaryStats, ActivityItem, ChartStats } from '../../domain/entities/DashboardStats';
import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { IDashboardRemoteDataSource } from '../datasources/DashboardRemoteDataSource';

export class DashboardRepositoryImpl implements IDashboardRepository {
  constructor(private readonly remoteDataSource: IDashboardRemoteDataSource) {}

  async getSummaryStats(): Promise<Result<SummaryStats>> {
    try {
      const stats = await this.remoteDataSource.getSummaryStats();
      return ok(stats);
    } catch (e: any) {
      return fail(new ServerFailure(e.message || 'Erreur lors du chargement des statistiques'));
    }
  }

  async getChartStats(): Promise<Result<ChartStats>> {
    try {
      const stats = await this.remoteDataSource.getChartStats();
      return ok(stats);
    } catch (e: any) {
      return fail(new ServerFailure(e.message || 'Erreur lors du chargement des statistiques'));
    }
  }

  async getRecentActivity(): Promise<Result<ActivityItem[]>> {
    try {
      const activities = await this.remoteDataSource.getRecentActivity();
      return ok(activities);
    } catch (e: any) {
      return fail(new ServerFailure(e.message || 'Erreur lors du chargement de l\'activité récente'));
    }
  }
}
