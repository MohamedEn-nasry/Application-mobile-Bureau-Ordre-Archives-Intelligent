import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';

import { UserProfile } from '../../domain/entities/UserProfile';
import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import { UserProfileRemoteDataSource } from '../datasources/UserProfileRemoteDataSource';
import { UserProfileMapper } from '../mappers/UserProfileMapper' ;

export class UserProfileRepositoryImpl implements UserProfileRepository {
    constructor(private remoteDataSource: UserProfileRemoteDataSource) { }

    async getById(id: number): Promise<Result<UserProfile>> {
        try {
            const response = await this.remoteDataSource.getById(id);
            const profile = UserProfileMapper.toDomain(response);
            return ok(profile);
            
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }
}