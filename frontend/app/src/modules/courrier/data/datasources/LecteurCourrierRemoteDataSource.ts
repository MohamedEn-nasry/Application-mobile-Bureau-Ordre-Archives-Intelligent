import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';
import { CourrierResponseModel } from './CourrierRemoteDataSource';

export interface LecteurCourrierParams {
    type?: string;
    categorieId?: number;
    search?: string;
}

export class LecteurCourrierRemoteDataSource {
    async getCourriers(params?: LecteurCourrierParams): Promise<CourrierResponseModel[]> {
        const queryParams = new URLSearchParams();

        if (params?.type) {
            queryParams.append('type', params.type);
        }

        if (params?.categorieId) {
            queryParams.append('categorieId', params.categorieId.toString());
        }

        if (params?.search) {
            queryParams.append('search', params.search);
        }

        const queryString = queryParams.toString();
        const url = queryString
            ? `${endpoints.courriers.lecteur}?${queryString}`
            : endpoints.courriers.lecteur;

        return await apiClient.get<CourrierResponseModel[]>(url);
    }
}
