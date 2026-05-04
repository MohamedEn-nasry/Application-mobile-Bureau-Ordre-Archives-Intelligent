import { BaseEntity } from '../../../../core/base/BaseEntity';

export class AgentProfile extends BaseEntity {
  constructor(
    Id: string,
    public readonly Name: string,
    public readonly Email: string,
    public readonly Role: 'AGENT',
    public readonly EmployeeId: string,
    public readonly Department: string,
    public readonly Position: string,
    public readonly Since: string,
    public readonly Statistics: {
      Processed: number;
      ThisMonth: number;
      Scans: number;
    },
    public readonly Preferences: {
      PushNotifications: boolean;
      Language: string;
    },
    public readonly AppVersion: {
      Version: string;
      Build: string;
    },
    public readonly Avatar?: string
  ) {
    super(Id);
  }
}
