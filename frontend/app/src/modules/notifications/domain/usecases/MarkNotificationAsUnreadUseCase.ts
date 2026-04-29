import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { NotificationsRepository } from '../repositories/NotificationsRepository';

export interface MarkAsUnreadParams {
  id: string;
}

export class MarkNotificationAsUnreadUseCase implements UseCase<boolean, MarkAsUnreadParams> {
  constructor(private repo: NotificationsRepository) {}

  async execute(params: MarkAsUnreadParams): Promise<Result<boolean>> {
    return await this.repo.markAsUnread(params.id);
  }
}
