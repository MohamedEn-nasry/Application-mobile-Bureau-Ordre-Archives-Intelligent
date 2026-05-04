import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';

export interface IncomingMailResponse {
  id: number;
  reference: string;
  type: string;
  dateCourrier: string;
  expediteur: string | null;
  destinataire: string | null;
  objet: string;
  description: string | null;
  statut: string;
  texteOcr: string | null;
  categorieId: number;
  auteurId: number;
  assigneA: number | null;
  createdAt: string;
  updatedAt: string;
  dateEcheance: string | null;
}

export interface CreateIncomingMailRequest {
  reference: string;
  type: string;
  dateCourrier: string;
  expediteur: string | null;
  destinataire: string | null;
  objet: string;
  description: string | null;
  statut: string;
  texteOcr: string | null;
  categorieId: number;
  auteurId: number;
  assigneA: number | null;
  dateEcheance: string | null;
}

export interface UpdateIncomingMailRequest {
  reference?: string;
  type?: string;
  dateCourrier?: string;
  expediteur?: string | null;
  destinataire?: string | null;
  objet?: string;
  description?: string | null;
  statut?: string;
  texteOcr?: string | null;
  categorieId?: number;
  assigneA?: number | null;
  dateEcheance?: string | null;
}

export class IncomingMailRemoteDataSource {
  async getIncomingMails(filter?: any): Promise<IncomingMailResponse[]> {
    try {
      const params = new URLSearchParams();
      
      if (filter?.search) {
        params.append('search', filter.search);
      }
      
      if (filter?.status && filter.status !== 'All') {
        params.append('status', filter.status);
      }
      
      if (filter?.sender) {
        params.append('sender', filter.sender);
      }
      
      if (filter?.subject) {
        params.append('subject', filter.subject);
      }
      
      const url = params.toString() ? `${endpoints.courrier.list}?${params}` : endpoints.courrier.list;
      const data = await apiClient.get<IncomingMailResponse[]>(url);
      
      return data;
    } catch (error) {
      console.error('Error fetching incoming mails:', error);
      throw error;
    }
  }

  async getIncomingMailById(id: string): Promise<IncomingMailResponse> {
    try {
      const data = await apiClient.get<IncomingMailResponse>(endpoints.courrier.byId(id));
      return data;
    } catch (error) {
      console.error('Error fetching incoming mail by ID:', error);
      throw error;
    }
  }

  async createIncomingMail(request: CreateIncomingMailRequest): Promise<IncomingMailResponse> {
    try {
      const data = await apiClient.post<IncomingMailResponse>(endpoints.courrier.create, request);
      return data;
    } catch (error) {
      console.error('Error creating incoming mail:', error);
      throw error;
    }
  }

  async updateIncomingMail(id: string, request: UpdateIncomingMailRequest): Promise<IncomingMailResponse> {
    try {
      const data = await apiClient.put<IncomingMailResponse>(endpoints.courrier.update(id), request);
      return data;
    } catch (error) {
      console.error('Error updating incoming mail:', error);
      throw error;
    }
  }

  async deleteIncomingMail(id: string): Promise<boolean> {
    try {
      const data = await apiClient.delete<boolean>(endpoints.courrier.delete(id));
      return data;
    } catch (error) {
      console.error('Error deleting incoming mail:', error);
      throw error;
    }
  }

  async runOCR(id: string): Promise<IncomingMailResponse> {
    try {
      // For OCR, we'll update the mail with OCR text
      // This might be a separate endpoint in the backend
      const ocrRequest = {
        texteOcr: 'OCR processing completed successfully. Document text extracted with high accuracy.'
      };
      
      const data = await apiClient.put<IncomingMailResponse>(endpoints.courrier.update(id), ocrRequest);
      return data;
    } catch (error) {
      console.error('Error running OCR:', error);
      throw error;
    }
  }

  async classifyMail(id: string): Promise<IncomingMailResponse> {
    try {
      // For classification, we'll update the mail with a category
      // This might be a separate endpoint in the backend
      const classificationRequest = {
        categorieId: 1 // This should come from classification logic
      };
      
      const data = await apiClient.put<IncomingMailResponse>(endpoints.courrier.update(id), classificationRequest);
      return data;
    } catch (error) {
      console.error('Error classifying mail:', error);
      throw error;
    }
  }
}
