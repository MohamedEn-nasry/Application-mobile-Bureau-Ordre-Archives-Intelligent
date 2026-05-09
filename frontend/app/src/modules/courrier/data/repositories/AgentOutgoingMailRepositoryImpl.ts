import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';

import { AgentOutgoingMail } from '../../domain/entities/AgentOutgoingMail';
import { AgentOutgoingMailRepository } from '../../domain/repositories/AgentOutgoingMailRepository';
import { AgentOutgoingMailRemoteDataSource } from '../datasources/AgentOutgoingMailRemoteDataSource';
import { AgentOutgoingMailMapper } from '../mappers/AgentOutgoingMailMapper';

export class AgentOutgoingMailRepositoryImpl implements AgentOutgoingMailRepository {
    constructor(
        private remoteDataSource: AgentOutgoingMailRemoteDataSource
    ) { }

    async getOutgoingMail(): Promise<Result<AgentOutgoingMail[]>> {
        try {
            const response = await this.remoteDataSource.getOutgoingMail();
            const items = AgentOutgoingMailMapper.toDomainList(response);

            return ok(items);
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }
}