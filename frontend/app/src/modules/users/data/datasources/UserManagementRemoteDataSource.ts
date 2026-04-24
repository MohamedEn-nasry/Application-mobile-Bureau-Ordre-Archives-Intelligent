import { apiClient } from '../../../../core/network/apiClient';
import { Role } from '../../../../shared/constants/roles';
import { endpoints } from "../../../../core/network/endpoints";

export interface UserResponseModel {
  id: string;
  FirstName: string;
  LastName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  ImagePath: string;
}

export class UserManagementRemoteDataSource {
  async createUser(FirstName: string, LastName: string, email: string, role: Role, password: string, ImagePath?: string): Promise<UserResponseModel> {
    const data = await apiClient.post<UserResponseModel>(endpoints.users.create, { FirstName, LastName, email, role, password, ImagePath });
    return data;
  }

  async getUsers(): Promise<UserResponseModel[]> {
    const data = await apiClient.get<UserResponseModel[]>(endpoints.users.list);
    return data;
  }
}
