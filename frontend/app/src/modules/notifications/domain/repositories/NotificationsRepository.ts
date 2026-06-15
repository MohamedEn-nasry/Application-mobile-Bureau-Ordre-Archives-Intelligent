import { Result } from '../../../../core/utils/result';
import { Notification } from '../entities/Notification';

export interface NotificationRepository {
  getNotifications(onlyUnread?: boolean): Promise<Result<Notification[]>>;
  getLecteurNotifications(onlyUnread?: boolean): Promise<Result<Notification[]>>;
  getSuperAgentNotifications(onlyUnread?: boolean): Promise<Result<Notification[]>>;
  getUnreadCount(): Promise<Result<number>>;
  markAsRead(id: number): Promise<Result<boolean>>;
  markAllAsRead(): Promise<Result<boolean>>;
  deleteNotification(id: number): Promise<Result<boolean>>;
}