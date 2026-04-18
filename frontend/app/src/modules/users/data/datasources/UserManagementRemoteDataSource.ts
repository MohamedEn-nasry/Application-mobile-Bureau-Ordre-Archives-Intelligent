import { apiClient } from '../../../../core/network/apiClient';
import { Role } from '../../../../shared/constants/roles';

export interface UserResponseModel {
  id: string;
  email: string;
  role: string;
  active: boolean;
}

export class UserManagementRemoteDataSource {
  async createUser(email: string, role: string, password?: string): Promise<UserResponseModel> {
    const data = await apiClient.post<UserResponseModel>('/users', { email, role, password });
    return data;
  }
  
  async getUsers(): Promise<UserResponseModel[]> {
    const data = await apiClient.get<UserResponseModel[]>('/users');
    return data;
  }
}
