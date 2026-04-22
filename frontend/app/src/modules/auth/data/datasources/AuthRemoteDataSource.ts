import { apiClient } from "../../../../core/network/apiClient";
import { endpoints } from "../../../../core/network/endpoints";

export interface AuthResponseModel {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
}

export class AuthRemoteDataSource {
  async login(email: string, password: string): Promise<AuthResponseModel> {
    const data = await apiClient.post<AuthResponseModel>(endpoints.auth.login, {
      email,
      password,
    });
    return data;
  }

  async logout(): Promise<void> {
    await apiClient.post(endpoints.auth.logout);
  }
}
