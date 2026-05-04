import { IncomingMailRepository, IncomingMailFilter, CreateIncomingMailDTO, UpdateIncomingMailDTO } from '../../domain/repositories/IncomingMailRepository';
import { IncomingMail } from '../../domain/entities/IncomingMail';
import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { IncomingMailRemoteDataSource } from '../datasources/IncomingMailRemoteDataSource';
import { IncomingMailMapper } from '../mappers/IncomingMailMapper';

export class IncomingMailRepositoryImpl implements IncomingMailRepository {
  constructor(private remoteDataSource: IncomingMailRemoteDataSource) {}

  async getIncomingMails(filter?: IncomingMailFilter): Promise<Result<IncomingMail[]>> {
    try {
      const response = await this.remoteDataSource.getIncomingMails(filter);
      const mails = IncomingMailMapper.toDomainList(response);
      return ok(mails);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async getIncomingMailById(id: string): Promise<Result<IncomingMail>> {
    try {
      const response = await this.remoteDataSource.getIncomingMailById(id);
      const mail = IncomingMailMapper.toDomain(response);
      return ok(mail);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async createIncomingMail(dto: CreateIncomingMailDTO): Promise<Result<IncomingMail>> {
    try {
      const request = IncomingMailMapper.toCreateRequest(dto);
      const response = await this.remoteDataSource.createIncomingMail(request);
      const mail = IncomingMailMapper.toDomain(response);
      return ok(mail);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async updateIncomingMail(id: string, dto: UpdateIncomingMailDTO): Promise<Result<IncomingMail>> {
    try {
      const request = IncomingMailMapper.toUpdateRequest(dto);
      const response = await this.remoteDataSource.updateIncomingMail(id, request);
      const mail = IncomingMailMapper.toDomain(response);
      return ok(mail);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async deleteIncomingMail(id: string): Promise<Result<boolean>> {
    try {
      const response = await this.remoteDataSource.deleteIncomingMail(id);
      return ok(response);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async runOCR(id: string): Promise<Result<IncomingMail>> {
    try {
      const response = await this.remoteDataSource.runOCR(id);
      const mail = IncomingMailMapper.toDomain(response);
      return ok(mail);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }

  async classifyMail(id: string): Promise<Result<IncomingMail>> {
    try {
      const response = await this.remoteDataSource.classifyMail(id);
      const mail = IncomingMailMapper.toDomain(response);
      return ok(mail);
    } catch (error: any) {
      return fail(new ServerFailure(error.message));
    }
  }
}
