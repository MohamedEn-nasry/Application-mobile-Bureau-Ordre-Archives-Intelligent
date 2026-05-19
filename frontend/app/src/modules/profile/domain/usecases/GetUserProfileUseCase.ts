import { Result } from '../../../../core/utils/result';
import { UserProfile } from '../entities/UserProfile';
import { UserProfileRepository } from '../repositories/UserProfileRepository';

export class GetUserProfileUseCase {
    constructor(private repo: UserProfileRepository) { }

    async execute(id: number): Promise<Result<UserProfile>> {
        return await this.repo.getById(id);
    }
}