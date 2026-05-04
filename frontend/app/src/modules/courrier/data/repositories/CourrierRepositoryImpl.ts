import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { Courrier } from '../../domain/entities/Courrier';
import {
  CourrierRepository,
  CreateCourrierParams,
  UpdateCourrierParams,
} from '../../domain/repositories/CourrierRepository';
import { CourrierRemoteDataSource } from '../datasources/CourrierRemoteDataSource';
import { CourrierMapper } from '../mappers/CourrierMapper';

export class CourrierRepositoryImpl implements CourrierRepository {
  constructor(private remoteDataSource: CourrierRemoteDataSource) {}

  async getCourriers(): Promise<Result<Courrier[]>> {
    try {
      const response = await this.remoteDataSource.getCourriers();
      console.log('Get Courriers Response:', response);

      const courriers = CourrierMapper.toDomainList(response);
      return ok(courriers);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async getCourrierById(id: number): Promise<Result<Courrier>> {
    try {
      const response = await this.remoteDataSource.getCourrierById(id);
      console.log('Get Courrier By Id Response:', response);

      const courrier = CourrierMapper.toDomain(response);
      return ok(courrier);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async createCourrier(params: CreateCourrierParams): Promise<Result<Courrier>> {
    try {
      const response = await this.remoteDataSource.createCourrier({
        reference: params.reference,
        type: params.type,
        dateCourrier: params.dateCourrier,
        expediteur: params.expediteur ?? null,
        destinataire: params.destinataire ?? null,
        objet: params.objet,
        description: params.description ?? null,
        texteOcr: params.texteOcr ?? null,
        categorieId: params.categorieId ?? null,
        assigneA: params.assigneA ?? null,
        dateEcheance: params.dateEcheance ?? null,
      });

      const courrier = CourrierMapper.toDomain(response);
      return ok(courrier);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async updateCourrier(params: UpdateCourrierParams): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.updateCourrier(params.id, {
        reference: params.reference,
        type: params.type,
        dateCourrier: params.dateCourrier,
        expediteur: params.expediteur ?? null,
        destinataire: params.destinataire ?? null,
        objet: params.objet,
        description: params.description ?? null,
        statut: params.statut,
        texteOcr: params.texteOcr ?? null,
        categorieId: params.categorieId ?? null,
        assigneA: params.assigneA ?? null,
        dateEcheance: params.dateEcheance ?? null,
      });

      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async updateCourrierStatus(id: number, statut: string): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.updateCourrierStatus(id, statut);
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async archiveCourrier(id: number): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.archiveCourrier(id);
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async deleteCourrier(id: number): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.deleteCourrier(id);
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async getCourriersAssignedToUser(userId: number): Promise<Result<Courrier[]>> {
    try {
      const response = await this.remoteDataSource.getCourriersAssignedToUser(userId);
      const courriers = CourrierMapper.toDomainList(response);
      return ok(courriers);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }
}