import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { ReportsOverview } from '../../domain/entities/ReportsOverview';
import { ReportsRepository } from '../../domain/repositories/ReportsRepository';
import { ReportsRemoteDataSource } from '../datasources/ReportsRemoteDataSource';

export class ReportsRepositoryImpl implements ReportsRepository {
  constructor(private remoteDataSource: ReportsRemoteDataSource) {}

  async getOverview(period: string): Promise<Result<ReportsOverview>> {
    try {
      const response = await this.remoteDataSource.getOverview(period);
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }
}