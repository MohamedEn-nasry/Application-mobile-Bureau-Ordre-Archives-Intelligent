import { Role } from '../../../../shared/constants/roles';

export class AuthSession {
  constructor(
    public readonly token: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly role: Role
  ) {}
}
