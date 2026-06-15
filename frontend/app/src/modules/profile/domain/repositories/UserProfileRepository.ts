import { Result } from '../../../../core/utils/result';
import { UserProfile } from '../entities/UserProfile';

export interface UserProfileRepository {
    getById(id: number): Promise<Result<UserProfile>>;
}