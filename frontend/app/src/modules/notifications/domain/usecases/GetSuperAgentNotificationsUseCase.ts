import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { Notification } from '../entities/Notification';
import { NotificationRepository } from '../repositories/NotificationsRepository';

export class GetSuperAgentNotificationsUseCase
  implements UseCase<Notification[], boolean | void> {
  constructor(private repository: NotificationRepository) { }

  execute(onlyUnread?: boolean): Promise<Result<Notification[]>> {
    return this.repository.getSuperAgentNotifications(onlyUnread);
  }
}
