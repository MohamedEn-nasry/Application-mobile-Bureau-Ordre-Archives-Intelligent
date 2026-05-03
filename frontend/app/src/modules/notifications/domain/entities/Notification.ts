import { BaseEntity } from '../../../../core/base/BaseEntity';

export enum NotificationType {
  SECURITY = 'security',
  SYSTEM = 'system',
  MAIL = 'mail',
  USER = 'user',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class Notification extends BaseEntity {
  constructor(
    Id: string,
    public readonly Title: string,
    public readonly Message: string,
    public readonly Type: NotificationType,
    public readonly IsRead: boolean,
    public readonly CreatedAt: Date,
    public readonly Priority: NotificationPriority = NotificationPriority.MEDIUM,
    public readonly ActionUrl?: string,
    public readonly ActionText?: string
  ) {
    super(Id);
  }

  get TimeAgo(): string {
    const now = new Date();
    const diffInMs = now.getTime() - this.CreatedAt.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return 'À l\'instant';
    if (diffInMins < 60) return `Il y a ${diffInMins} min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    
    return this.CreatedAt.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: this.CreatedAt.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  get DisplayPriority(): NotificationPriority {
    return this.Priority;
  }

  get IsUnread(): boolean {
    return !this.IsRead;
  }

  static create(
    id: string,
    title: string,
    message: string,
    type: NotificationType,
    isRead: boolean,
    createdAt: Date,
    priority?: NotificationPriority,
    actionUrl?: string,
    actionText?: string
  ): Notification {
    return new Notification(id, title, message, type, isRead, createdAt, priority, actionUrl, actionText);
  }
}
