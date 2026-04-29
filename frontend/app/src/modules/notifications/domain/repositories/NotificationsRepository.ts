import { Result } from '../../../../core/utils/result';
import { Notification, NotificationType } from '../entities/Notification';

export interface NotificationsRepository {
  getNotifications(type?: NotificationType): Promise<Result<Notification[]>>;
  markAsRead(id: string): Promise<Result<boolean>>;
  markAsUnread(id: string): Promise<Result<boolean>>;
  markAllAsRead(): Promise<Result<boolean>>;
  getUnreadCount(type?: NotificationType): Promise<Result<number>>;
  getNotificationById(id: string): Promise<Result<Notification>>;
  deleteNotification(id: string): Promise<Result<boolean>>;
}
