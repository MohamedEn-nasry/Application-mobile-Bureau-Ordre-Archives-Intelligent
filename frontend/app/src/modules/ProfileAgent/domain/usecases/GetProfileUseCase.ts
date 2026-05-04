import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { AgentProfile } from '../entities/AgentProfile';
import { ProfileRepository } from '../repositories/ProfileRepository';

export class GetProfileUseCase implements UseCase<AgentProfile, NoParams> {
  constructor(private repo: ProfileRepository) {}

  async execute(): Promise<Result<AgentProfile>> {
    return await this.repo.getProfile();
  }
}
