import { UserProfile } from '../../domain/entities/UserProfile';
import { UserProfileResponseModel } from '../models/UserProfileResponseModel' ;

export class UserProfileMapper {
    static toDomain(model: UserProfileResponseModel): UserProfile {

        return new UserProfile(
            model.id.toString(),
            model.firstname,
            model.lastname,
            model.email,
            model.roleName,
            model.isActif,
            new Date(model.createdAt),
            new Date(model.updatedAt),
            model.imagePath || ''
        );
    }
}