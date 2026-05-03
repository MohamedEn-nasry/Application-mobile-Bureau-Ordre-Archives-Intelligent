import { BaseEntity } from '../../../../core/base/BaseEntity';

export type Environment = 'development' | 'staging' | 'production';

export interface FeatureFlag {
  name: string;
  enabled: boolean;
}

export interface DatabaseConfig {
  type: string;
  maxConnections: number;
  currentConnections: number;
}

export interface AuthConfig {
  jwtExpirationHours: number;
  requireEmailVerification: boolean;
  maxLoginAttempts: number;
}

export class SystemConfig extends BaseEntity {
  constructor(
    id: string,
    public readonly apiVersion: string,
    public readonly environment: Environment,
    public readonly buildNumber: string,
    public readonly features: FeatureFlag[],
    public readonly database: DatabaseConfig,
    public readonly auth: AuthConfig,
    public readonly corsOrigins: string[],
    public readonly lastUpdated: string,
  ) {
    super(id);
  }
}
