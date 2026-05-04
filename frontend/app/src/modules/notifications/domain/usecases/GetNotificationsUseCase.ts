import { Result } from '../../../../core/utils/result';
import { Notification } from '../entities/Notification';
import { NotificationRepository } from '../repositories/NotificationsRepository';

export class GetNotificationsUseCase {
  constructor(private repo: NotificationRepository) {}

  async execute(onlyUnread: boolean = false): Promise<Result<Notification[]>> {
    return await this.repo.getNotifications(onlyUnread);
  }
}