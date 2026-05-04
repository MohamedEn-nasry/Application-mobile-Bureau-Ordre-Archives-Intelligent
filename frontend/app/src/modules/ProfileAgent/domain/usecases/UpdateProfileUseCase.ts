import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { AgentProfile } from '../entities/AgentProfile';
import { ProfileRepository } from '../repositories/ProfileRepository';

export class UpdateProfileUseCase implements UseCase<AgentProfile, Partial<AgentProfile>> {
  constructor(private repo: ProfileRepository) {}

  async execute(params: Partial<AgentProfile>): Promise<Result<AgentProfile>> {
    return await this.repo.updateProfile(params);
  }
}
