import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { Notification, NotificationType } from '../entities/Notification';
import { NotificationsRepository } from '../repositories/NotificationsRepository';

export interface GetNotificationsParams {
  type?: NotificationType;
}

export class GetNotificationsUseCase implements UseCase<Notification[], GetNotificationsParams> {
  constructor(private repo: NotificationsRepository) {}

  async execute(params?: GetNotificationsParams): Promise<Result<Notification[]>> {
    return await this.repo.getNotifications(params?.type);
  }
}
