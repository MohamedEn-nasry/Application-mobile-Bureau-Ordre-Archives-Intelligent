import { UserEmailLookup } from '../../domain/entities/UserEmailLookup';
import { UserEmailLookupResponseModel } from '../models/UserEmailLookupResponseModel';

export class UserEmailLookupMapper {
    static toDomain(model: UserEmailLookupResponseModel): UserEmailLookup {
        return new UserEmailLookup(
            model.id.toString(),
            model.firstname,
            model.lastname,
            model.email,
            model.roleName
        );
    }

    static toDomainList(models: UserEmailLookupResponseModel[]): UserEmailLookup[] {
        return models.map(this.toDomain);
    }
}