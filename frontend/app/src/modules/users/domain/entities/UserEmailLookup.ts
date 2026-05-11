import { BaseEntity } from '../../../../core/base/BaseEntity';

export class UserEmailLookup extends BaseEntity {
    constructor(
        id: string,
        public readonly Firstname: string,
        public readonly Lastname: string,
        public readonly Email: string,
        public readonly RoleName: string
    ) {
        super(id);
    }

    get FullName(): string {
        return `${this.Firstname} ${this.Lastname}`.trim();
    }
}