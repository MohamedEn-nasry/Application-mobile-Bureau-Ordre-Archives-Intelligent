import { BaseEntity } from '../../../../core/base/BaseEntity';
import { Role } from '../../../../shared/constants/roles';

export class ManagedUser extends BaseEntity {
  constructor(
    Id: string,
    public readonly FirstName: string,
    public readonly LastName: string,
    public readonly Email: string,
    public readonly RoleName: Role,
    public readonly IsActive: boolean,
    public readonly CreatedAt: Date,
    public readonly UpdatedAt: Date,
    public readonly ImagePath: string
  ) {
    super(Id);
  }
}
