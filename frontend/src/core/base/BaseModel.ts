/**
 * Base model interface for data layer models
 * These represent the data structure from external sources (API, database, etc.)
 */
export interface BaseModel {
  id?: string | number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Base model implementation with common functionality
 */
export abstract class BaseModelImpl implements BaseModel {
  public id?: string | number;
  public created_at?: string;
  public updated_at?: string;

  /**
   * Convert model to plain object
   */
  toJSON(): Record<string, any> {
    return { ...this };
  }

  /**
   * Create model from plain object
   */
  static fromJSON<T extends BaseModel>(
    this: new () => T,
    json: Record<string, any>
  ): T {
    const model = new this();
    Object.assign(model, json);
    return model;
  }

  /**
   * Validate model structure
   */
  validate(): boolean {
    return true; // Override in subclasses
  }

  /**
   * Get model as API payload
   */
  toAPIPayload(): Record<string, any> {
    const payload = this.toJSON();
    // Remove undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });
    return payload;
  }
}
