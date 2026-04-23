import { Result, safeAsync } from '@core/utils/result';
import { Failure } from '@core/error/failures';

/**
 * Local storage interface for abstracting storage operations
 */
export interface Storage {
  get<T>(key: string): Promise<Result<T | null>>;
  set<T>(key: string, value: T): Promise<Result<void>>;
  remove(key: string): Promise<Result<void>>;
  clear(): Promise<Result<void>>;
  keys(): Promise<Result<string[]>>;
}

/**
 * AsyncStorage implementation for React Native
 */
export class AsyncStorage implements Storage {
  async get<T>(key: string): Promise<Result<T | null>> {
    return safeAsync(async () => {
      try {
        const value = require('@react-native-async-storage/async-storage').default.getItem(key);
        const result = await value;
        return result ? JSON.parse(result) : null;
      } catch {
        return null;
      }
    });
  }

  async set<T>(key: string, value: T): Promise<Result<void>> {
    return safeAsync(async () => {
      const serializedValue = JSON.stringify(value);
      await require('@react-native-async-storage/async-storage').default.setItem(key, serializedValue);
    });
  }

  async remove(key: string): Promise<Result<void>> {
    return safeAsync(async () => {
      await require('@react-native-async-storage/async-storage').default.removeItem(key);
    });
  }

  async clear(): Promise<Result<void>> {
    return safeAsync(async () => {
      await require('@react-native-async-storage/async-storage').default.clear();
    });
  }

  async keys(): Promise<Result<string[]>> {
    return safeAsync(async () => {
      return await require('@react-native-async-storage/async-storage').default.getAllKeys();
    });
  }
}

/**
 * In-memory storage implementation for testing or development
 */
export class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  async get<T>(key: string): Promise<Result<T | null>> {
    return safeAsync(async () => {
      const value = this.data.get(key);
      return value ? JSON.parse(value) : null;
    });
  }

  async set<T>(key: string, value: T): Promise<Result<void>> {
    return safeAsync(async () => {
      this.data.set(key, JSON.stringify(value));
    });
  }

  async remove(key: string): Promise<Result<void>> {
    return safeAsync(async () => {
      this.data.delete(key);
    });
  }

  async clear(): Promise<Result<void>> {
    return safeAsync(async () => {
      this.data.clear();
    });
  }

  async keys(): Promise<Result<string[]>> {
    return safeAsync(async () => {
      return Array.from(this.data.keys());
    });
  }
}

/**
 * Storage factory for creating appropriate storage instance
 */
export class StorageFactory {
  static createStorage(type: 'async' | 'memory' = 'async'): Storage {
    switch (type) {
      case 'async':
        return new AsyncStorage();
      case 'memory':
        return new MemoryStorage();
      default:
        return new MemoryStorage();
    }
  }
}
