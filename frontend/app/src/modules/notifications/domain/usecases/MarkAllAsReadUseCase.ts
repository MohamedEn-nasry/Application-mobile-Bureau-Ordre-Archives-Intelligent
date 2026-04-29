import { UseCase, NoParams } from '../../../../core/base/UseCase';
import { Result } from '../../../../core/utils/result';
import { NotificationsRepository } from '../repositories/NotificationsRepository';

export class MarkAllAsReadUseCase implements UseCase<boolean, NoParams> {
  constructor(private repo: NotificationsRepository) {}

  async execute(): Promise<Result<boolean>> {
    return await this.repo.markAllAsRead();
  }
}
