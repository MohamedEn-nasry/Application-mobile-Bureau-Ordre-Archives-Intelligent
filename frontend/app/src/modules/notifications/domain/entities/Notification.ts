import { BaseEntity } from '../../../../core/base/BaseEntity';

export enum NotificationType {
  SECURITY = 'Security',
  SYSTEM = 'System',
  MAIL = 'Mail',
  USER = 'User',
}

export class Notification extends BaseEntity {
  constructor(
    Id: string,
    public readonly UserId: number,
    public readonly Title: string,
    public readonly Message: string,
    public readonly Type: string,
    public readonly EntityType: string | null,
    public readonly EntityId: number | null,
    public readonly IsRead: boolean,
    public readonly CreatedBy: number | null,
    public readonly CreatedAt: Date,
    public readonly ReadAt: Date | null
  ) {
    super(Id);
  }

  // Pure dynamic getters for UI layer consumption
  get TimeAgo(): string {
    const now = new Date();
    const created = new Date(this.CreatedAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return `Il y a ${diffDays} j`;
  }

  get ActionText(): string | null {
    if (this.EntityType === 'Courrier') {
      return 'Voir le courrier';
    }
    return null;
  }

  get ActionUrl(): string | null {
    if (this.EntityType === 'Courrier' && this.EntityId) {
      return `/courrier/${this.EntityId}`;
    }
    return null;
  }
}