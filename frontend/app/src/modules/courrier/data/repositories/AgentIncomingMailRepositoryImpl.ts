import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';
import { Courrier } from '../../domain/entities/Courrier';
import { AgentIncomingMailRepository } from '../../domain/repositories/AgentIncomingMailRepository';
import { AgentIncomingMailRemoteDataSource } from '../datasources/AgentIncomingMailRemoteDataSource';
import { CourrierMapper } from '../mappers/CourrierMapper';

export class AgentIncomingMailRepositoryImpl implements AgentIncomingMailRepository {
    constructor(
        private remoteDataSource: AgentIncomingMailRemoteDataSource
    ) { }

    async getIncomingMail(): Promise<Result<Courrier[]>> {
        try {
            const response = await this.remoteDataSource.getIncomingMail();
            return ok(CourrierMapper.toDomainList(response));
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }
}