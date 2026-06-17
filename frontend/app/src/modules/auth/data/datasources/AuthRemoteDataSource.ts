import { apiClient } from "../../../../core/network/apiClient";
import { endpoints } from "../../../../core/network/endpoints";

export interface AuthResponseModel {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface RefreshResponseModel {
  accessToken: string;
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

  async refresh(email: string, refreshToken: string): Promise<RefreshResponseModel> {
    const data = await apiClient.post<RefreshResponseModel>(
      endpoints.auth.refresh,
      { email, refreshToken },
    );
    return data;
  }

  async logout(email: string, refreshToken: string): Promise<void> {
    await apiClient.post(endpoints.auth.logout, { email, refreshToken });
  }
}
