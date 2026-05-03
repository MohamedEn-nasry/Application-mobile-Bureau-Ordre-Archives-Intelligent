import { SystemStatus } from '../../domain/entities/SystemStatus';
import { SystemConfig } from '../../domain/entities/SystemConfig';
import { SystemInfoApiDataSource, SystemStatusResponse, SystemConfigResponse } from '../datasources/SystemInfoApiDataSource';

export class SystemInfoRepository {
  private dataSource: SystemInfoApiDataSource;

  constructor(baseUrl?: string) {
    this.dataSource = new SystemInfoApiDataSource(baseUrl);
  }

  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const response = await this.dataSource.getSystemStatus();
      return this.mapStatusResponseToEntity(response);
    } catch (error) {
      throw new Error(`Repository error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getSystemConfig(): Promise<SystemConfig> {
    try {
      const response = await this.dataSource.getSystemConfig();
      return this.mapConfigResponseToEntity(response);
    } catch (error) {
      throw new Error(`Repository error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private mapStatusResponseToEntity(response: SystemStatusResponse): SystemStatus {
    return new SystemStatus(
      'system-status-1',
      response.serverStatus,
      response.databaseStatus,
      response.apiHealth,
      response.uptime,
      response.activeUsers,
      response.memoryUsage,
      response.cpuUsage,
      response.lastUpdated,
    );
  }

  private mapConfigResponseToEntity(response: SystemConfigResponse): SystemConfig {
    return new SystemConfig(
      'system-config-1',
      response.apiVersion,
      response.environment,
      response.buildNumber,
      response.features.map(feature => ({
        name: feature.name,
        enabled: feature.enabled,
      })),
      {
        type: response.database.type,
        maxConnections: response.database.maxConnections,
        currentConnections: response.database.currentConnections,
      },
      {
        jwtExpirationHours: response.auth.jwtExpirationHours,
        requireEmailVerification: response.auth.requireEmailVerification,
        maxLoginAttempts: response.auth.maxLoginAttempts,
      },
      response.corsOrigins,
      response.lastUpdated,
    );
  }
}
