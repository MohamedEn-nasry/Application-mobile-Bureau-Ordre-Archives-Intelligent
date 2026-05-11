import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';

import { UserEmailLookup } from '../../domain/entities/UserEmailLookup';
import { UserLookupRepository } from '../../domain/repositories/UserLookupRepository';
import { UserLookupRemoteDataSource } from '../datasources/UserLookupRemoteDataSource';
import { UserEmailLookupMapper } from '../mappers/UserEmailLookupMapper';

export class UserLookupRepositoryImpl implements UserLookupRepository {
    constructor(private remoteDataSource: UserLookupRemoteDataSource) { }

    async searchByEmail(email: string): Promise<Result<UserEmailLookup[]>> {
        try {
            const response = await this.remoteDataSource.searchByEmail(email);
            return ok(UserEmailLookupMapper.toDomainList(response));
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }
}