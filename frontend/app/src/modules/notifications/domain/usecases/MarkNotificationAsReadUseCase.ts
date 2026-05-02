import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { NotificationsRepository } from '../repositories/NotificationsRepository';

export interface MarkAsReadParams {
  id: string;
}

export class MarkNotificationAsReadUseCase implements UseCase<boolean, MarkAsReadParams> {
  constructor(private repo: NotificationsRepository) {}

  async execute(params: MarkAsReadParams): Promise<Result<boolean>> {
    return await this.repo.markAsRead(params.id);
  }
}
