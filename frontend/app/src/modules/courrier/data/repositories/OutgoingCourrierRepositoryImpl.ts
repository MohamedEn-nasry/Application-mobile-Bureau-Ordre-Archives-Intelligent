import { IOutgoingCourrierRepository } from '../../domain/repositories/IOutgoingCourrierRepository';
import { OutgoingCourrier } from '../../domain/entities/OutgoingCourrier';
import { CourrierFilter } from '../../domain/entities/CourrierFilter';
import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure, NetworkFailure } from '../../../../core/error/failures';
import { IOutgoingCourrierRemoteDataSource } from '../datasources/OutgoingCourrierRemoteDataSource';

export class OutgoingCourrierRepositoryImpl implements IOutgoingCourrierRepository {
  constructor(private readonly remoteDataSource: IOutgoingCourrierRemoteDataSource) {}

  async getOutgoingCourrier(filter?: CourrierFilter): Promise<Result<OutgoingCourrier[]>> {
    try {
      const courriers = await this.remoteDataSource.getOutgoingCourrier(filter);
      return ok(courriers);
    } catch (error: any) {
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return fail(new NetworkFailure('Network connection failed'));
      }
      return fail(new ServerFailure(error.message || 'Failed to fetch outgoing courrier'));
    }
  }

  async getCourrierById(id: string): Promise<Result<OutgoingCourrier>> {
    try {
      const courrier = await this.remoteDataSource.getCourrierById(id);
      return ok(courrier);
    } catch (error: any) {
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return fail(new NetworkFailure('Network connection failed'));
      }
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return fail(new ServerFailure('Courrier not found', 'NOT_FOUND'));
      }
      return fail(new ServerFailure(error.message || 'Failed to fetch courrier details'));
    }
  }

  async createCourrier(courrier: Omit<OutgoingCourrier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<OutgoingCourrier>> {
    try {
      const newCourrier = await this.remoteDataSource.createCourrier(courrier);
      return ok(newCourrier);
    } catch (error: any) {
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return fail(new NetworkFailure('Network connection failed'));
      }
      if (error.message?.includes('validation') || error.message?.includes('400')) {
        return fail(new ServerFailure('Invalid courrier data', 'VALIDATION_ERROR'));
      }
      return fail(new ServerFailure(error.message || 'Failed to create courrier'));
    }
  }

  async updateCourrier(id: string, courrier: Partial<OutgoingCourrier>): Promise<Result<OutgoingCourrier>> {
    try {
      const updatedCourrier = await this.remoteDataSource.updateCourrier(id, courrier);
      return ok(updatedCourrier);
    } catch (error: any) {
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return fail(new NetworkFailure('Network connection failed'));
      }
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return fail(new ServerFailure('Courrier not found', 'NOT_FOUND'));
      }
      if (error.message?.includes('validation') || error.message?.includes('400')) {
        return fail(new ServerFailure('Invalid courrier data', 'VALIDATION_ERROR'));
      }
      return fail(new ServerFailure(error.message || 'Failed to update courrier'));
    }
  }

  async deleteCourrier(id: string): Promise<Result<void>> {
    try {
      await this.remoteDataSource.deleteCourrier(id);
      return ok(undefined);
    } catch (error: any) {
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return fail(new NetworkFailure('Network connection failed'));
      }
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return fail(new ServerFailure('Courrier not found', 'NOT_FOUND'));
      }
      return fail(new ServerFailure(error.message || 'Failed to delete courrier'));
    }
  }

  async archiveCourrier(id: string): Promise<Result<void>> {
    try {
      await this.remoteDataSource.archiveCourrier(id);
      return ok(undefined);
    } catch (error: any) {
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return fail(new NetworkFailure('Network connection failed'));
      }
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return fail(new ServerFailure('Courrier not found', 'NOT_FOUND'));
      }
      return fail(new ServerFailure(error.message || 'Failed to archive courrier'));
    }
  }

  async reassignCourrier(id: string, newRecipient: string): Promise<Result<OutgoingCourrier>> {
    try {
      const reassignedCourrier = await this.remoteDataSource.reassignCourrier(id, newRecipient);
      return ok(reassignedCourrier);
    } catch (error: any) {
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return fail(new NetworkFailure('Network connection failed'));
      }
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return fail(new ServerFailure('Courrier not found', 'NOT_FOUND'));
      }
      if (error.message?.includes('validation') || error.message?.includes('400')) {
        return fail(new ServerFailure('Invalid recipient data', 'VALIDATION_ERROR'));
      }
      return fail(new ServerFailure(error.message || 'Failed to reassign courrier'));
    }
  }

  async getTotalCount(filter?: CourrierFilter): Promise<Result<number>> {
    try {
      const count = await this.remoteDataSource.getTotalCount(filter);
      return ok(count);
    } catch (error: any) {
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return fail(new NetworkFailure('Network connection failed'));
      }
      return fail(new ServerFailure(error.message || 'Failed to get courrier count'));
    }
  }
}
