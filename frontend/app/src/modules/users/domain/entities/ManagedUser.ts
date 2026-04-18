import { BaseEntity } from '../../../../core/base/BaseEntity';
import { Role } from '../../../../shared/constants/roles';

export class ManagedUser extends BaseEntity {
  constructor(
    id: string,
    public readonly email: string,
    public readonly role: Role,
    public readonly active: boolean
  ) {
    super(id);
  }
}
