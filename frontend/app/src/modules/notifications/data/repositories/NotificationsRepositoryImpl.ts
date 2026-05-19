import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';

import { Notification } from '../../domain/entities/Notification';
import { NotificationRepository } from '../../domain/repositories/NotificationsRepository';
import { NotificationRemoteDataSource } from '../datasources/NotificationsRemoteDataSource';
import { NotificationMapper } from '../mappers/NotificationsMapper';

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(private remoteDataSource: NotificationRemoteDataSource) {}

  async getNotifications(onlyUnread: boolean = false): Promise<Result<Notification[]>> {
    try {
      const response = await this.remoteDataSource.getNotifications(onlyUnread);
      return ok(NotificationMapper.toDomainList(response));
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async getLecteurNotifications(onlyUnread: boolean = false): Promise<Result<Notification[]>> {
    try {
      const response = await this.remoteDataSource.getLecteurNotifications(onlyUnread);
      return ok(NotificationMapper.toDomainList(response));
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async getSuperAgentNotifications(onlyUnread: boolean = false): Promise<Result<Notification[]>> {
    try {
      const response = await this.remoteDataSource.getSuperAgentNotifications(onlyUnread);
      return ok(NotificationMapper.toDomainList(response));
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async getUnreadCount(): Promise<Result<number>> {
    try {
      const response = await this.remoteDataSource.getUnreadCount();
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async markAsRead(id: number): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.markAsRead(id);
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async markAllAsRead(): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.markAllAsRead();
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async deleteNotification(id: number): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.deleteNotification(id);
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }
}