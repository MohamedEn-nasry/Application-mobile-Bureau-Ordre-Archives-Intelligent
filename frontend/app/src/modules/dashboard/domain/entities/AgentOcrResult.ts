import { BaseEntity } from '../../../../core/base/BaseEntity';

export class AgentOcrResult extends BaseEntity {
    constructor(
        id: string,
        public readonly CourrierId: number,
        public readonly PieceJointeId: number,
        public readonly Reference: string,
        public readonly Objet: string,
        public readonly Type: string,
        public readonly TexteExtrait: string,
        public readonly Confiance: number,
        public readonly CreatedAt: Date
    ) {
        super(id);
    }
}