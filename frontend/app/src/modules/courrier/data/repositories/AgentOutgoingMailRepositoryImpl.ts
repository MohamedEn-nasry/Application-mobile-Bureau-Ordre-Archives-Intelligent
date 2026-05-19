import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { Courrier } from '../../domain/entities/Courrier';
import { AgentOutgoingMailRepository } from '../../domain/repositories/AgentOutgoingMailRepository';
import { AgentOutgoingMailRemoteDataSource } from '../datasources/AgentOutgoingMailRemoteDataSource';
import { CourrierMapper } from '../mappers/CourrierMapper';

export class AgentOutgoingMailRepositoryImpl implements AgentOutgoingMailRepository {
    constructor(
        private remoteDataSource: AgentOutgoingMailRemoteDataSource
    ) { }

    async getOutgoingMail(): Promise<Result<Courrier[]>> {
        try {
            const response = await this.remoteDataSource.getOutgoingMail();
            return ok(CourrierMapper.toDomainList(response));
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }
}