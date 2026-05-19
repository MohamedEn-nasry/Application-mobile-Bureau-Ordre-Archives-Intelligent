import { Role } from '../../../../shared/constants/roles';

export interface UserProfileResponseModel {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    roleName: Role;
    isActif: boolean;
    createdAt: string;
    updatedAt: string;
    imagePath: string;
}