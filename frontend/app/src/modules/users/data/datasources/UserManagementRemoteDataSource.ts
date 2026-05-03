import { apiClient } from '../../../../core/network/apiClient';
import { Role } from '../../../../shared/constants/roles';
import { endpoints } from "../../../../core/network/endpoints";
import { ChangePasswordDTO } from '../../../../shared/domain/entities/ChangePassword';

export interface UserResponseModel {
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

export class UserManagementRemoteDataSource {
  async createUser(
    firstname: string,
    lastname: string,
    email: string,
    roleName: string,
    password: string,
    isActive: boolean,
    imagePath?: string
  ): Promise<UserResponseModel> {
    const payload = {
      Firstname: firstname,
      Lastname: lastname,
      Email: email,
      Password: password,
      RoleName: roleName,
      IsActif: isActive,
      ImagePath: imagePath
    };

    console.log('Sending Create User Payload:', JSON.stringify(payload, null, 2));

    const data = await apiClient.post<UserResponseModel>(
      endpoints.users.create,
      payload
    );

    return data;
  }


  async getUsers(): Promise<UserResponseModel[]> {
    const data = await apiClient.get<UserResponseModel[]>(endpoints.users.list);
    return data;
  }

  async deactivateUser(id: number): Promise<boolean> {
    const response = await apiClient.put<boolean>(endpoints.users.deactivate(id));
    return response;
  }

  async activateUser(id: number): Promise<boolean> {
    const response = await apiClient.put<boolean>(endpoints.users.activate(id));
    return response;
  }

  async updateUser(id: number, userData: any): Promise<boolean> {
    const payload = {
      Firstname: userData.firstname,
      Lastname: userData.lastname,
      Email: userData.email,
      RoleName: userData.roleName,
      IsActif: userData.isActive,
      ImagePath: userData.imagePath
    };

    console.log('Sending Update User Payload:', JSON.stringify(payload, null, 2));
    console.log('To endpoint:', endpoints.users.update(id));

    const response = await apiClient.put<boolean>(endpoints.users.update(id), payload);
    return response;
  }

  async changePassword(dto: ChangePasswordDTO): Promise<boolean> {
    const payload: ChangePasswordDTO = {
      Id: dto.Id,
      OldPassword: dto.OldPassword,
      NewPassword: dto.NewPassword,
    };

    const response = await apiClient.post<any>(
      endpoints.users.changePassword(dto.Id),
      payload
    );
    console.log(endpoints.users.changePassword(dto.Id), payload);
    // Backend currently returns a string in Ok(...). Treat any 2xx as success.
    return response !== undefined;
  }
}
