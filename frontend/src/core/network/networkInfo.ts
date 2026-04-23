/**
 * Network information utilities
 * Provides network status and connectivity information
 */

export interface NetworkInfo {
  isConnected: boolean;
  isConnectedInternet: boolean;
  type: NetworkType;
  details?: NetworkDetails;
}

export enum NetworkType {
  NONE = 'none',
  CELLULAR = 'cellular',
  WIFI = 'wifi',
  BLUETOOTH = 'bluetooth',
  ETHERNET = 'ethernet',
  OTHER = 'other',
  UNKNOWN = 'unknown',
}

export interface NetworkDetails {
  isConnectionExpensive: boolean;
  cellularGeneration?: CellularGeneration;
  wifiDetails?: WifiDetails;
}

export enum CellularGeneration {
  NONE = 'none',
  '2G' = '2g',
  '3G' = '3g',
  '4G' = '4g',
  '5G' = '5g',
}

export interface WifiDetails {
  ssid?: string;
  strength?: number;
  frequency?: number;
}

/**
 * Network info provider interface
 */
export interface NetworkInfoProvider {
  getCurrentNetworkInfo(): Promise<NetworkInfo>;
  subscribe(callback: (networkInfo: NetworkInfo) => void): () => void;
}

/**
 * Mock network info provider for development/testing
 */
export class MockNetworkInfoProvider implements NetworkInfoProvider {
  private subscribers: ((networkInfo: NetworkInfo) => void)[] = [];
  private currentNetworkInfo: NetworkInfo = {
    isConnected: true,
    isConnectedInternet: true,
    type: NetworkType.WIFI,
    details: {
      isConnectionExpensive: false,
      cellularGeneration: CellularGeneration.NONE,
      wifiDetails: {
        ssid: 'Mock WiFi',
        strength: 80,
        frequency: 2400,
      },
    },
  };

  async getCurrentNetworkInfo(): Promise<NetworkInfo> {
    return this.currentNetworkInfo;
  }

  subscribe(callback: (networkInfo: NetworkInfo) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // For testing purposes
  setNetworkInfo(networkInfo: NetworkInfo): void {
    this.currentNetworkInfo = networkInfo;
    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.currentNetworkInfo));
  }
}

/**
 * Network info utility functions
 */
export class NetworkUtils {
  static isOnline(networkInfo: NetworkInfo): boolean {
    return networkInfo.isConnected && networkInfo.isConnectedInternet;
  }

  static isCellular(networkInfo: NetworkInfo): boolean {
    return networkInfo.type === NetworkType.CELLULAR;
  }

  static isWifi(networkInfo: NetworkInfo): boolean {
    return networkInfo.type === NetworkType.WIFI;
  }

  static isConnectionExpensive(networkInfo: NetworkInfo): boolean {
    return networkInfo.details?.isConnectionExpensive ?? false;
  }

  static getCellularGeneration(networkInfo: NetworkInfo): CellularGeneration {
    return networkInfo.details?.cellularGeneration ?? CellularGeneration.NONE;
  }

  static getWifiStrength(networkInfo: NetworkInfo): number | null {
    return networkInfo.details?.wifiDetails?.strength ?? null;
  }

  static getNetworkTypeLabel(networkInfo: NetworkInfo): string {
    switch (networkInfo.type) {
      case NetworkType.NONE:
        return 'No Connection';
      case NetworkType.CELLULAR:
        return 'Mobile Data';
      case NetworkType.WIFI:
        return 'WiFi';
      case NetworkType.BLUETOOTH:
        return 'Bluetooth';
      case NetworkType.ETHERNET:
        return 'Ethernet';
      case NetworkType.OTHER:
        return 'Other';
      case NetworkType.UNKNOWN:
      default:
        return 'Unknown';
    }
  }

  static shouldUseOfflineMode(networkInfo: NetworkInfo): boolean {
    return !this.isOnline(networkInfo) || this.isConnectionExpensive(networkInfo);
  }
}
