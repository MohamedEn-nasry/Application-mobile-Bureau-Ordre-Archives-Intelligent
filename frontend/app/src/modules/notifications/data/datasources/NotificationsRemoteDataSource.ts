import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { NotificationType, NotificationPriority } from '../../domain/entities/Notification';

export interface NotificationResponseModel {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  priority: NotificationPriority;
  actionUrl?: string;
  actionText?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface UnreadCountResponse {
  count: number;
}

export interface UpdateResponse {
  updated: boolean;
  count?: number;
}

export interface DeleteResponse {
  deleted: boolean;
}

export class NotificationsRemoteDataSource {
  async getNotifications(type?: NotificationType): Promise<NotificationResponseModel[]> {
    try {
      const params = type ? { type } : undefined;
      const response = await apiClient.get<ApiResponse<NotificationResponseModel[]>>(
        endpoints.notifications.list,
        params
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch notifications: ${error}`);
    }
  }

  async markAsRead(id: string): Promise<boolean> {
    try {
      const response = await apiClient.put<ApiResponse<UpdateResponse>>(
        endpoints.notifications.markAsRead(id)
      );
      return response.data.updated;
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error}`);
    }
  }

  async markAsUnread(id: string): Promise<boolean> {
    try {
      const response = await apiClient.put<ApiResponse<UpdateResponse>>(
        endpoints.notifications.markAsUnread(id)
      );
      return response.data.updated;
    } catch (error) {
      throw new Error(`Failed to mark notification as unread: ${error}`);
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      const response = await apiClient.put<ApiResponse<UpdateResponse>>(
        endpoints.notifications.markAllRead
      );
      return response.data.updated;
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error}`);
    }
  }

  async getUnreadCount(type?: NotificationType): Promise<number> {
    try {
      const params = type ? { type } : undefined;
      const response = await apiClient.get<ApiResponse<UnreadCountResponse>>(
        endpoints.notifications.unreadCount,
        params
      );
      return response.data.count;
    } catch (error) {
      throw new Error(`Failed to get unread count: ${error}`);
    }
  }

  async getNotificationById(id: string): Promise<NotificationResponseModel> {
    try {
      const response = await apiClient.get<ApiResponse<NotificationResponseModel>>(
        endpoints.notifications.byId(id)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get notification: ${error}`);
    }
  }

  async deleteNotification(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<ApiResponse<DeleteResponse>>(
        endpoints.notifications.delete(id)
      );
      return response.data.deleted;
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error}`);
    }
  }
}
