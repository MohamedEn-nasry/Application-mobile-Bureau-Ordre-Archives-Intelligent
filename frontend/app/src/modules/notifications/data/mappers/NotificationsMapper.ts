import { Notification } from '../../domain/entities/Notification';
import { NotificationResponseModel } from '../datasources/NotificationsRemoteDataSource';

export class NotificationMapper {
  static toDomain(model: NotificationResponseModel): Notification {
    return new Notification(
      model.id.toString(),
      model.userId,
      model.title,
      model.message,
      model.type,
      model.entityType ?? null,
      model.entityId ?? null,
      model.isRead,
      model.createdBy ?? null,
      new Date(model.createdAt),
      model.readAt ? new Date(model.readAt) : null
    );
  }

  static toDomainList(models: NotificationResponseModel[]): Notification[] {
    return models.map(this.toDomain);
  }
}