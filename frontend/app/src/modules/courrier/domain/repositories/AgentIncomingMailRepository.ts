import { Result } from '../../../../core/utils/result';
import { AgentIncomingMail } from '../entities/AgentIncomingMail';

export interface AgentIncomingMailRepository {
    getIncomingMail(): Promise<Result<AgentIncomingMail[]>>;
}