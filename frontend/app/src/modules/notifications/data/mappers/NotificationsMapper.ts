import { Notification } from '../../domain/entities/Notification';
import { NotificationResponseModel } from '../datasources/NotificationsRemoteDataSource';

export class NotificationsMapper {
  static toDomain(responseModel: NotificationResponseModel): Notification {
    return Notification.create(
      responseModel.id,
      responseModel.title,
      responseModel.message,
      responseModel.type,
      responseModel.isRead,
      new Date(responseModel.createdAt),
      responseModel.priority,
      responseModel.actionUrl,
      responseModel.actionText
    );
  }

  static toDomainArray(responseModels: NotificationResponseModel[]): Notification[] {
    return responseModels.map(model => this.toDomain(model));
  }

  static toResponseModel(domain: Notification): NotificationResponseModel {
    return {
      id: domain.id,
      title: domain.Title,
      message: domain.Message,
      type: domain.Type,
      isRead: domain.IsRead,
      createdAt: domain.CreatedAt.toISOString(),
      priority: domain.Priority,
      actionUrl: domain.ActionUrl,
      actionText: domain.ActionText
    };
  }

  static toResponseModelArray(domains: Notification[]): NotificationResponseModel[] {
    return domains.map(domain => this.toResponseModel(domain));
  }
}
