import { Result } from '../../../../core/utils/result';
import { UserEmailLookup } from '../entities/UserEmailLookup';

export interface UserLookupRepository {
    searchByEmail(email: string): Promise<Result<UserEmailLookup[]>>;
}