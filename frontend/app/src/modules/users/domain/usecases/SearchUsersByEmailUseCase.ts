import { Result } from '../../../../core/utils/result';
import { UserEmailLookup } from '../entities/UserEmailLookup';
import { UserLookupRepository } from '../repositories/UserLookupRepository';

export class SearchUsersByEmailUseCase {
    constructor(private repo: UserLookupRepository) { }

    async execute(email: string): Promise<Result<UserEmailLookup[]>> {
        return await this.repo.searchByEmail(email);
    }
}