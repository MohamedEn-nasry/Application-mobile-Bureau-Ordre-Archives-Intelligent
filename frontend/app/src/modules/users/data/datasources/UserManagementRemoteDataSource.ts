import { apiClient } from '../../../../core/network/apiClient';
import { Role } from '../../../../shared/constants/roles';
import { endpoints } from "../../../../core/network/endpoints";

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
    const data = await apiClient.post<UserResponseModel>(
      endpoints.users.create,
      {
        firstname,
        lastname,
        email,
        password,
        roleName,
        isActive,
        imagePath
      }
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
}
