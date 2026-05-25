import { BaseEntity } from '../../../../core/base/BaseEntity';

export class PieceJointeImage extends BaseEntity {
    constructor(
        id: string,
        public readonly NomFichier: string,
        public readonly TypeFichier: string,
        public readonly DataUrl: string
    ) {
        super(id);
    }
}