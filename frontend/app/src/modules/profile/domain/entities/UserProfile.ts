import { BaseEntity } from '../../../../core/base/BaseEntity';
import { Role } from '../../../../shared/constants/roles';

export class UserProfile extends BaseEntity {
    constructor(
        id: string,
        public readonly FirstName: string,
        public readonly LastName: string,
        public readonly Email: string,
        public readonly RoleName: Role,
        public readonly IsActive: boolean,
        public readonly CreatedAt: Date,
        public readonly UpdatedAt: Date,
        public readonly ImagePath: string
    ) {
        super(id);
    }

    get FullName(): string {
        return `${this.FirstName} ${this.LastName}`.trim();
    }

    get Initials(): string {
        const first = this.FirstName?.charAt(0)?.toUpperCase() || '';
        const last = this.LastName?.charAt(0)?.toUpperCase() || '';
        return `${first}${last}` || 'U';
    }
}