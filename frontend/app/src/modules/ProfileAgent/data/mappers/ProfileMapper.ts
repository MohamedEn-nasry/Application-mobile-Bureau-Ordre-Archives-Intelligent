import { AgentProfile } from '../../domain/entities/AgentProfile';

export interface ProfileDTO {
  id: string;
  name: string;
  email: string;
  role: 'AGENT';
  avatar?: string;
  employeeId: string;
  department: string;
  position: string;
  since: string;
  statistics: {
    Processed: number;
    ThisMonth: number;
    Scans: number;
  };
  preferences: {
    PushNotifications: boolean;
    Language: string;
  };
  appVersion: {
    Version: string;
    Build: string;
  };
}

export class ProfileMapper {
  static toEntity(dto: ProfileDTO): AgentProfile {
    return new AgentProfile(
      dto.id,
      dto.name,
      dto.email,
      dto.role,
      dto.employeeId,
      dto.department,
      dto.position,
      dto.since,
      dto.statistics,
      dto.preferences,
      dto.appVersion,
      dto.avatar
    );
  }

  static toDTO(entity: AgentProfile): ProfileDTO {
    return {
      id: entity.id,
      name: entity.Name,
      email: entity.Email,
      role: entity.Role,
      employeeId: entity.EmployeeId,
      department: entity.Department,
      position: entity.Position,
      since: entity.Since,
      statistics: entity.Statistics,
      preferences: entity.Preferences,
      appVersion: entity.AppVersion,
      avatar: entity.Avatar,
    };
  }
}
