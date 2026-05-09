import { Result, ok, fail } from '../../../../core/utils/result';
import { ServerFailure } from '../../../../core/error/failures';

import { AgentIncomingMail } from '../../domain/entities/AgentIncomingMail';
import { AgentIncomingMailRepository } from '../../domain/repositories/AgentIncomingMailRepository';
import { AgentIncomingMailRemoteDataSource } from '../datasources/AgentIncomingMailRemoteDataSource';
import { AgentIncomingMailMapper } from '../mappers/AgentIncomingMailMapper';

export class AgentIncomingMailRepositoryImpl implements AgentIncomingMailRepository {
    constructor(
        private remoteDataSource: AgentIncomingMailRemoteDataSource
    ) { }

    async getIncomingMail(): Promise<Result<AgentIncomingMail[]>> {
        try {
            const response = await this.remoteDataSource.getIncomingMail();
            const items = AgentIncomingMailMapper.toDomainList(response);

            return ok(items);
        } catch (error: any) {
            return fail(new ServerFailure(error.message));
        }
    }
}