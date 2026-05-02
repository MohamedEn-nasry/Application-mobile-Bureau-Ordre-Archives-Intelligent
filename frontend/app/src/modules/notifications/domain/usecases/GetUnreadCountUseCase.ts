import { UseCase } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { NotificationType } from '../entities/Notification';
import { NotificationsRepository } from '../repositories/NotificationsRepository';

export interface GetUnreadCountParams {
  type?: NotificationType;
}

export class GetUnreadCountUseCase implements UseCase<number, GetUnreadCountParams> {
  constructor(private repo: NotificationsRepository) {}

  async execute(params?: GetUnreadCountParams): Promise<Result<number>> {
    return await this.repo.getUnreadCount(params?.type);
  }
}
