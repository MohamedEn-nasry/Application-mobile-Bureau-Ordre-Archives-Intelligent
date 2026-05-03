import { Result } from '../../../../core/utils/result';
import { OutgoingCourrier } from '../entities/OutgoingCourrier';
import { CourrierFilter } from '../entities/CourrierFilter';

export interface IOutgoingCourrierRepository {
  getOutgoingCourrier(filter?: CourrierFilter): Promise<Result<OutgoingCourrier[]>>;
  getCourrierById(id: string): Promise<Result<OutgoingCourrier>>;
  createCourrier(courrier: Omit<OutgoingCourrier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<OutgoingCourrier>>;
  updateCourrier(id: string, courrier: Partial<OutgoingCourrier>): Promise<Result<OutgoingCourrier>>;
  deleteCourrier(id: string): Promise<Result<void>>;
  archiveCourrier(id: string): Promise<Result<void>>;
  reassignCourrier(id: string, newRecipient: string): Promise<Result<OutgoingCourrier>>;
  getTotalCount(filter?: CourrierFilter): Promise<Result<number>>;
}
