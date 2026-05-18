import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { Courrier } from '../../domain/entities/Courrier';
import { LecteurCourrierRepository, LecteurCourrierFilters } from '../../domain/repositories/LecteurCourrierRepository';
import { LecteurCourrierRemoteDataSource } from '../datasources/LecteurCourrierRemoteDataSource';
import { CourrierMapper } from '../mappers/CourrierMapper';

export class LecteurCourrierRepositoryImpl implements LecteurCourrierRepository {
    constructor(
        private remoteDataSource: LecteurCourrierRemoteDataSource
    ) { }

    async getCourriers(filters?: LecteurCourrierFilters): Promise<Result<Courrier[]>> {
        try {
            const response = await this.remoteDataSource.getCourriers(filters);
            return ok(CourrierMapper.toDomainList(response));
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }
}
