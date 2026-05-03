import { SystemStatus } from '../entities/SystemStatus';
import { SystemConfig } from '../entities/SystemConfig';
import { SystemInfoRepository } from '../../data/repositories/SystemInfoRepository';

export interface GetSystemInfoResult {
  status: SystemStatus;
  config: SystemConfig;
}

export class GetSystemInfoUseCase {
  private repository: SystemInfoRepository;

  constructor(baseUrl?: string) {
    this.repository = new SystemInfoRepository(baseUrl);
  }

  async execute(): Promise<GetSystemInfoResult> {
    try {
      const [status, config] = await Promise.all([
        this.repository.getSystemStatus(),
        this.repository.getSystemConfig(),
      ]);
      
      return {
        status,
        config,
      };
    } catch (error) {
      throw new Error(`Failed to get system information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async refreshStatus(): Promise<SystemStatus> {
    try {
      return await this.repository.getSystemStatus();
    } catch (error) {
      throw new Error(`Failed to refresh system status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async refreshConfig(): Promise<SystemConfig> {
    try {
      return await this.repository.getSystemConfig();
    } catch (error) {
      throw new Error(`Failed to refresh system config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
