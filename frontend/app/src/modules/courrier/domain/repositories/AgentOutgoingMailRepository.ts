import { Result } from '../../../../core/utils/result';
import { Courrier } from '../entities/Courrier';

export interface AgentOutgoingMailRepository {
    getOutgoingMail(): Promise<Result<Courrier[]>>;
}