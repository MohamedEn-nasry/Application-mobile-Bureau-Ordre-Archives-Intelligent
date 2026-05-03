// import { apiClient } from '../../../../core/network/apiClient';
// import { endpoints } from '../../../../core/network/endpoints';
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

// Mock data for notifications
const mockNotifications: NotificationResponseModel[] = [
  {
    id: '1',
    title: 'Nouvel utilisateur inscrit',
    message: 'Jean Dupont a créé un compte et attend validation',
    type: NotificationType.USER,
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z',
    priority: NotificationPriority.MEDIUM,
    actionUrl: '/admin/users',
    actionText: 'Voir utilisateur'
  },
  {
    id: '2',
    title: 'Mise à jour système',
    message: 'La version 2.1.0 est maintenant disponible',
    type: NotificationType.SYSTEM,
    isRead: true,
    createdAt: '2024-01-14T09:15:00Z',
    priority: NotificationPriority.LOW,
    actionUrl: '/admin/settings',
    actionText: 'Mettre à jour'
  },
  {
    id: '3',
    title: 'Alerte sécurité',
    message: 'Tentative de connexion suspectée depuis une adresse IP inconnue',
    type: NotificationType.SECURITY,
    isRead: false,
    createdAt: '2024-01-13T14:45:00Z',
    priority: NotificationPriority.HIGH,
    actionUrl: '/admin/security',
    actionText: 'Vérifier'
  },
  {
    id: '4',
    title: 'Courrier en attente',
    message: '5 documents nécessitent votre validation',
    type: NotificationType.MAIL,
    isRead: false,
    createdAt: '2024-01-12T16:20:00Z',
    priority: NotificationPriority.MEDIUM,
    actionUrl: '/admin/mail',
    actionText: 'Voir courrier'
  },
  {
    id: '5',
    title: 'Rapport mensuel disponible',
    message: 'Le rapport d\'activité pour janvier est prêt',
    type: NotificationType.SYSTEM,
    isRead: true,
    createdAt: '2024-01-11T11:00:00Z',
    priority: NotificationPriority.LOW,
    actionUrl: '/admin/reports',
    actionText: 'Télécharger'
  },
  {
    id: '6',
    title: 'Nouveau rôle créé',
    message: 'Le rôle "Superviseur" a été ajouté au système',
    type: NotificationType.USER,
    isRead: true,
    createdAt: '2024-01-10T08:30:00Z',
    priority: NotificationPriority.LOW,
    actionUrl: '/admin/roles',
    actionText: 'Voir rôle'
  },
  {
    id: '7',
    title: 'Sauvegarde réussie',
    message: 'La sauvegarde automatique des données a été effectuée',
    type: NotificationType.SYSTEM,
    isRead: true,
    createdAt: '2024-01-09T02:00:00Z',
    priority: NotificationPriority.LOW
  },
  {
    id: '8',
    title: 'Courrier urgent',
    message: 'Document prioritaire nécessite votre attention immédiate',
    type: NotificationType.MAIL,
    isRead: false,
    createdAt: '2024-01-08T13:15:00Z',
    priority: NotificationPriority.HIGH,
    actionUrl: '/admin/mail/urgent',
    actionText: 'Voir maintenant'
  }
];

export class NotificationsRemoteDataSource {
  async getNotifications(type?: NotificationType): Promise<NotificationResponseModel[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (type) {
      return mockNotifications.filter(n => n.type === type);
    }
    return mockNotifications;
  }

  async markAsRead(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      return true;
    }
    return false;
  }

  async markAsUnread(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = false;
      return true;
    }
    return false;
  }

  async markAllAsRead(): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    mockNotifications.forEach(n => n.isRead = true);
    return true;
  }

  async getUnreadCount(type?: NotificationType): Promise<number> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (type) {
      return mockNotifications.filter(n => n.type === type && !n.isRead).length;
    }
    return mockNotifications.filter(n => !n.isRead).length;
  }

  async getNotificationById(id: string): Promise<NotificationResponseModel> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const notification = mockNotifications.find(n => n.id === id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  }

  async deleteNotification(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index > -1) {
      mockNotifications.splice(index, 1);
      return true;
    }
    return false;
  }
}
