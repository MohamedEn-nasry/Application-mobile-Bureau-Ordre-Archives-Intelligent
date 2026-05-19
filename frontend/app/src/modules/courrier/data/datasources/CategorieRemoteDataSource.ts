import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';

export interface CategorieResponseModel {
  id: number;
  nom: string;
  description?: string | null;
}

export class CategorieRemoteDataSource {
  async getCategories(): Promise<CategorieResponseModel[]> {
    const data = await apiClient.get<CategorieResponseModel[]>(
      endpoints.categories.list
    );

    return data;
  }
}