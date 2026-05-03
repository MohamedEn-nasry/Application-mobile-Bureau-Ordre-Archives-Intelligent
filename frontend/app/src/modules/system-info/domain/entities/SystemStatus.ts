import { BaseEntity } from '../../../../core/base/BaseEntity';

export type ServerStatus = 'online' | 'offline' | 'maintenance';
export type DatabaseStatus = 'connected' | 'disconnected' | 'error';
export type HealthStatus = 'healthy' | 'warning' | 'critical';

export class SystemStatus extends BaseEntity {
  constructor(
    id: string,
    public readonly serverStatus: ServerStatus,
    public readonly databaseStatus: DatabaseStatus,
    public readonly apiHealth: HealthStatus,
    public readonly uptime: string,
    public readonly activeUsers: number,
    public readonly memoryUsage: number,
    public readonly cpuUsage: number,
    public readonly lastUpdated: string,
  ) {
    super(id);
  }
}
