import { ok, fail, Result } from '../../../../core/utils/result';
import { Notification, NotificationType } from '../../domain/entities/Notification';
import { NotificationsRepository } from '../../domain/repositories/NotificationsRepository';
import { NotificationsRemoteDataSource } from '../datasources/NotificationsRemoteDataSource';
import { NotificationsMapper } from '../mappers/NotificationsMapper';

export class NotificationsRepositoryImpl implements NotificationsRepository {
  constructor(private dataSource: NotificationsRemoteDataSource) {}

  async getNotifications(type?: NotificationType): Promise<Result<Notification[]>> {
    try {
      const responseModels = await this.dataSource.getNotifications(type);
      const notifications = NotificationsMapper.toDomainArray(responseModels);
      return ok(notifications);
    } catch (error) {
      return fail(error as Error);
    }
  }

  async markAsRead(id: string): Promise<Result<boolean>> {
    try {
      const result = await this.dataSource.markAsRead(id);
      return ok(result);
    } catch (error) {
      return fail(error as Error);
    }
  }

  async markAsUnread(id: string): Promise<Result<boolean>> {
    try {
      const result = await this.dataSource.markAsUnread(id);
      return ok(result);
    } catch (error) {
      return fail(error as Error);
    }
  }

  async markAllAsRead(): Promise<Result<boolean>> {
    try {
      const result = await this.dataSource.markAllAsRead();
      return ok(result);
    } catch (error) {
      return fail(error as Error);
    }
  }

  async getUnreadCount(type?: NotificationType): Promise<Result<number>> {
    try {
      const count = await this.dataSource.getUnreadCount(type);
      return ok(count);
    } catch (error) {
      return fail(error as Error);
    }
  }

  async getNotificationById(id: string): Promise<Result<Notification>> {
    try {
      const responseModel = await this.dataSource.getNotificationById(id);
      const notification = NotificationsMapper.toDomain(responseModel);
      return ok(notification);
    } catch (error) {
      return fail(error as Error);
    }
  }

  async deleteNotification(id: string): Promise<Result<boolean>> {
    try {
      const result = await this.dataSource.deleteNotification(id);
      return ok(result);
    } catch (error) {
      return fail(error as Error);
    }
  }
}
