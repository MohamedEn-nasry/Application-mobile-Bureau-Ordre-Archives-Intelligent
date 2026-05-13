import { BaseEntity } from '../../../../core/base/BaseEntity';

export class PieceJointe extends BaseEntity {
    constructor(
        id: string,
        public readonly CourrierId: number,
        public readonly NomFichier: string,
        public readonly TypeFichier: string,
        public readonly CheminFichier: string,
        public readonly Format: string,
        public readonly Taille: number,
        public readonly EstScan: boolean,
        public readonly CreatedAt: Date
    ) {
        super(id);
    }

    get IsImage(): boolean {
        const type = this.TypeFichier.toLowerCase();
        const format = this.Format.toLowerCase();

        return (
            type.includes('image') ||
            ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif'].includes(format)
        );
    }
}