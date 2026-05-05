import { Result } from '../../../../core/utils/result';
import { NotificationRepository } from '../repositories/NotificationsRepository';

export class GetUnreadNotificationsCountUseCase {
  constructor(private repo: NotificationRepository) {}

  async execute(): Promise<Result<number>> {
    return await this.repo.getUnreadCount();
  }
}