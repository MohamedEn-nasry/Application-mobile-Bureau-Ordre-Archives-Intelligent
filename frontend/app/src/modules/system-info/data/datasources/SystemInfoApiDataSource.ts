
export interface SystemStatusResponse {
  serverStatus: 'online' | 'offline' | 'maintenance';
  databaseStatus: 'connected' | 'disconnected' | 'error';
  apiHealth: 'healthy' | 'warning' | 'critical';
  uptime: string;
  activeUsers: number;
  memoryUsage: number;
  cpuUsage: number;
  lastUpdated: string;
}

export interface SystemConfigResponse {
  apiVersion: string;
  environment: 'development' | 'staging' | 'production';
  buildNumber: string;
  features: {
    name: string;
    enabled: boolean;
  }[];
  database: {
    type: string;
    maxConnections: number;
    currentConnections: number;
  };
  auth: {
    jwtExpirationHours: number;
    requireEmailVerification: boolean;
    maxLoginAttempts: number;
  };
  corsOrigins: string[];
  lastUpdated: string;
}

export class SystemInfoApiDataSource {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5000/api') {
    this.baseUrl = baseUrl;
  }

  async getSystemStatus(): Promise<SystemStatusResponse> {
    const response = await fetch(`${this.baseUrl}/system/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch system status: ${response.statusText}`);
    }

    return response.json();
  }

  async getSystemConfig(): Promise<SystemConfigResponse> {
    const response = await fetch(`${this.baseUrl}/system/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch system config: ${response.statusText}`);
    }

    return response.json();
  }

  private async getAuthToken(): Promise<string> {
    // This should retrieve the JWT token from secure storage
    // Implementation depends on your auth storage solution
    // For now, returning a placeholder - this needs to be implemented
    return 'YOUR_JWT_TOKEN_HERE';
  }
}
