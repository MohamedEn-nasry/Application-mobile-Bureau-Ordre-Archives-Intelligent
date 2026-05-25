import { Result } from '../../../../core/utils/result';
import { Courrier } from '../entities/Courrier';

export interface AgentIncomingMailRepository {
    getIncomingMail(): Promise<Result<Courrier[]>>;
}