import { Result } from '../../../../core/utils/result';
import { NotificationRepository } from '../repositories/NotificationsRepository';

export class MarkAllNotificationsAsReadUseCase {
  constructor(private repo: NotificationRepository) {}

  async execute(): Promise<Result<boolean>> {
    return await this.repo.markAllAsRead();
  }
}