import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';

import { UserManagementRepository } from '../repositories/UserManagementRepository';

export class DeactivateUserUseCase implements UseCase<boolean, number> {
    constructor(private repo: UserManagementRepository) { }

    async execute(id: number): Promise<Result<boolean>> {
        return await this.repo.deactivateUser(id);
    }
}