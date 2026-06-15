import { Result } from '../utils/result';

export interface BaseRepository<Entity> {
  getAll(): Promise<Result<Entity[]>>;
  getById(id: string): Promise<Result<Entity>>;
  create(entity: Entity): Promise<Result<Entity>>;
  update(id: string, entity: Entity): Promise<Result<Entity>>;
  delete(id: string): Promise<Result<void>>;
}
