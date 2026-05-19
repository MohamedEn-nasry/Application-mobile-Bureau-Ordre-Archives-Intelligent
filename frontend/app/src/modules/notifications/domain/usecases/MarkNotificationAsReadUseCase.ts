import { Result } from '../../../../core/utils/result';
import { NotificationRepository } from '../repositories/NotificationsRepository';

export class MarkNotificationAsReadUseCase {
  constructor(private repo: NotificationRepository) {}

  async execute(id: number): Promise<Result<boolean>> {
    return await this.repo.markAsRead(id);
  }
}