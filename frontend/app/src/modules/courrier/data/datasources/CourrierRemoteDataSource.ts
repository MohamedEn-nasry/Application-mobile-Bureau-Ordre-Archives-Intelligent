import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';

export interface CourrierResponseModel {
  id: number;
  reference: string;
  type: string;
  dateCourrier: string;
  expediteur?: string | null;
  destinataire?: string | null;
  objet: string;
  description?: string | null;
  statut: string;
  texteOcr?: string | null;
  categorieId?: number | null;
  auteurId: number;
  assigneA?: number | null;
  createdAt: string;
  updatedAt: string;
  dateEcheance?: string | null;
  pieceJointeCount?: number;
}

export interface CreateCourrierRequestModel {
  reference: string;
  type: string;
  dateCourrier: string;
  expediteur?: string | null;
  destinataire?: string | null;
  objet: string;
  description?: string | null;
  texteOcr?: string | null;
  categorieId?: number | null;
  assigneA?: number | null;
  dateEcheance?: string | null;
}

export interface UpdateCourrierRequestModel {
  reference: string;
  type: string;
  dateCourrier: string;
  expediteur?: string | null;
  destinataire?: string | null;
  objet: string;
  description?: string | null;
  statut: string;
  texteOcr?: string | null;
  categorieId?: number | null;
  assigneA?: number | null;
  dateEcheance?: string | null;
}

export class CourrierRemoteDataSource {
  async getCourriers(): Promise<CourrierResponseModel[]> {
    const data = await apiClient.get<CourrierResponseModel[]>(
      endpoints.courriers.list
    );

    return data;
  }

  async getCourrierById(id: number): Promise<CourrierResponseModel> {
    const data = await apiClient.get<CourrierResponseModel>(
      endpoints.courriers.getById(id)
    );

    return data;
  }

  async createCourrier(
    payload: CreateCourrierRequestModel
  ): Promise<CourrierResponseModel> {
    console.log('Sending Create Courrier Payload:', JSON.stringify(payload, null, 2));

    const data = await apiClient.post<CourrierResponseModel>(
      endpoints.courriers.create,
      payload
    );

    return data;
  }

  async updateCourrier(
    id: number,
    payload: UpdateCourrierRequestModel
  ): Promise<boolean> {
    console.log('Sending Update Courrier Payload:', JSON.stringify(payload, null, 2));
    console.log('To endpoint:', endpoints.courriers.update(id));

    const response = await apiClient.put<boolean>(
      endpoints.courriers.update(id),
      payload
    );

    return response !== undefined;
  }

  async updateCourrierStatus(id: number, statut: string): Promise<boolean> {
    const payload = { statut };

    console.log('Sending Update Status Payload:', payload);

    const response = await apiClient.put<boolean>(
      endpoints.courriers.updateStatus(id),
      payload
    );

    return response !== undefined;
  }

  async archiveCourrier(id: number): Promise<boolean> {
    return await this.updateCourrierStatus(id, 'Archive');
  }

  async deleteCourrier(id: number): Promise<boolean> {
    const response = await apiClient.delete<boolean>(
      endpoints.courriers.delete(id)
    );

    return response !== undefined;
  }

  async getCourriersAssignedToUser(userId: number): Promise<CourrierResponseModel[]> {
    const data = await apiClient.get<CourrierResponseModel[]>(
      endpoints.courriers.assigned(userId)
    );

    return data;
  }
}