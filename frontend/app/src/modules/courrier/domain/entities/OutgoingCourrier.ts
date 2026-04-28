import { BaseEntity } from '../../../../core/base/BaseEntity';

export interface OutgoingCourrier extends BaseEntity {
  reference: string;
  recipient: string;
  subject: string;
  description?: string;
  dateSent: Date;
  status: CourrierStatus;
  priority: CourrierPriority;
  attachments?: string[];
  createdBy: string;
  type?: 'outgoing' | 'incoming';
}

export enum CourrierStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  ARCHIVED = 'archived',
  CANCELLED = 'cancelled'
}

export enum CourrierPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export class OutgoingCourrierEntity extends BaseEntity {
  constructor(
    id: string,
    public readonly reference: string,
    public readonly recipient: string,
    public readonly subject: string,
    public readonly description: string | undefined,
    public readonly dateSent: Date,
    public readonly status: CourrierStatus,
    public readonly priority: CourrierPriority,
    public readonly attachments: string[] | undefined,
    public readonly createdBy: string,
    public readonly type?: 'outgoing' | 'incoming',
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }
}
