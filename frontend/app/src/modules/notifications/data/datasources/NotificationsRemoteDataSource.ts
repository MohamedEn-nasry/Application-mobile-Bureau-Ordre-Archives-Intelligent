import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';

export interface NotificationResponseModel {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  entityType?: string | null;
  entityId?: number | null;
  isRead: boolean;
  createdBy?: number | null;
  createdAt: string;
  readAt?: string | null;
}

export interface UnreadCountResponseModel {
  count: number;
}

export class NotificationRemoteDataSource {
  async getNotifications(onlyUnread: boolean = false): Promise<NotificationResponseModel[]> {
    const url = onlyUnread
      ? `${endpoints.notifications.list}?onlyUnread=true`
      : endpoints.notifications.list;

    const data = await apiClient.get<NotificationResponseModel[]>(url);
    return data;
  }

  async getLecteurNotifications(onlyUnread: boolean = false): Promise<NotificationResponseModel[]> {
    const baseUrl = endpoints.notifications.lecteur();
    const url = onlyUnread ? `${baseUrl}?onlyUnread=true` : baseUrl;
    const data = await apiClient.get<NotificationResponseModel[]>(url);
    return data;
  }

  async getUnreadCount(): Promise<number> {
    const data = await apiClient.get<UnreadCountResponseModel>(
      endpoints.notifications.unreadCount
    );

    return data.count;
  }

  async markAsRead(id: number): Promise<boolean> {
    await apiClient.put<any>(endpoints.notifications.markAsRead(id));
    return true;
  }

  async markAllAsRead(): Promise<boolean> {
    await apiClient.put<any>(endpoints.notifications.markAllAsRead);
    return true;
  }

  async deleteNotification(id: number): Promise<boolean> {
    await apiClient.delete<any>(endpoints.notifications.delete(id));
    return true;
  }
}