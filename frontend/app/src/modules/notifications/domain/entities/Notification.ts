import { BaseEntity } from '../../../../core/base/BaseEntity';

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
}