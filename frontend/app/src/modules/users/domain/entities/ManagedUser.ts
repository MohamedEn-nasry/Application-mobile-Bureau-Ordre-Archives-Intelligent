import { BaseEntity } from '../../../../core/base/BaseEntity';
import { Role } from '../../../../shared/constants/roles';

export class ManagedUser extends BaseEntity {
  constructor(
    id: string,
    public readonly FirstName: string,
    public readonly LastName: string,
    public readonly email: string,
    public readonly role: Role,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly ImagePath: string
  ) {
    super(id);
  }
}
