import { Result } from '../../../../core/utils/result';
import { AgentOutgoingMail } from '../entities/AgentOutgoingMail';

export interface AgentOutgoingMailRepository {
    getOutgoingMail(): Promise<Result<AgentOutgoingMail[]>>;
}