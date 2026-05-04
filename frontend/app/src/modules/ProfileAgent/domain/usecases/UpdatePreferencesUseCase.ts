import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { ProfileRepository } from '../repositories/ProfileRepository';

export interface UpdatePreferencesParams {
  pushNotifications: boolean;
  language: string;
}

export class UpdatePreferencesUseCase implements UseCase<boolean, UpdatePreferencesParams> {
  constructor(private repo: ProfileRepository) {}

  async execute(params: UpdatePreferencesParams): Promise<Result<boolean>> {
    return await this.repo.updatePreferences(params);
  }
}
