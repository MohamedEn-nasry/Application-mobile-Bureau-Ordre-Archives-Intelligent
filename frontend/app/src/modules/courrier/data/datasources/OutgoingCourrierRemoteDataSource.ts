import { apiClient } from '../../../../core/network/apiClient';
import { endpoints } from '../../../../core/network/endpoints';

import { OutgoingCourrier, CourrierStatus, CourrierPriority } from '../../domain/entities/OutgoingCourrier';
import { CourrierFilter } from '../../domain/entities/CourrierFilter';

export interface IOutgoingCourrierRemoteDataSource {
  getOutgoingCourrier(filter?: CourrierFilter): Promise<OutgoingCourrier[]>;
  getCourrierById(id: string): Promise<OutgoingCourrier>;
  createCourrier(courrier: Omit<OutgoingCourrier, 'id' | 'createdAt' | 'updatedAt'>): Promise<OutgoingCourrier>;
  updateCourrier(id: string, courrier: Partial<OutgoingCourrier>): Promise<OutgoingCourrier>;
  deleteCourrier(id: string): Promise<void>;
  archiveCourrier(id: string): Promise<void>;
  reassignCourrier(id: string, newRecipient: string): Promise<OutgoingCourrier>;
  getTotalCount(filter?: CourrierFilter): Promise<number>;
}

// TODO: Replace with actual API integration when backend is ready
// This file should make HTTP requests to the backend API

export class OutgoingCourrierRemoteDataSource implements IOutgoingCourrierRemoteDataSource {
  async getOutgoingCourrier(filter?: CourrierFilter): Promise<OutgoingCourrier[]> {
    try {
      const params = {
        type: 'outgoing',
        ...filter
      };
      
      const response = await apiClient.get<OutgoingCourrier[]>(endpoints.courrier.base, params);
      return response;
    } catch (error) {
      console.error('Error fetching outgoing courriers:', error);
      throw error;
    }
  }

  async getCourrierById(id: string): Promise<OutgoingCourrier> {
    try {
      const response = await apiClient.get<OutgoingCourrier>(endpoints.courrier.byId(id));
      return response;
    } catch (error) {
      console.error(`Error fetching courrier ${id}:`, error);
      throw error;
    }
  }

  async createCourrier(courrier: Omit<OutgoingCourrier, 'id' | 'createdAt' | 'updatedAt'>): Promise<OutgoingCourrier> {
    try {
      const response = await apiClient.post<OutgoingCourrier>(endpoints.courrier.base, courrier);
      return response;
    } catch (error) {
      console.error('Error creating courrier:', error);
      throw error;
    }
  }

  async updateCourrier(id: string, courrier: Partial<OutgoingCourrier>): Promise<OutgoingCourrier> {
    try {
      const response = await apiClient.put<OutgoingCourrier>(endpoints.courrier.byId(id), courrier);
      return response;
    } catch (error) {
      console.error(`Error updating courrier ${id}:`, error);
      throw error;
    }
  }

  async deleteCourrier(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(endpoints.courrier.byId(id));
    } catch (error) {
      console.error(`Error deleting courrier ${id}:`, error);
      throw error;
    }
  }

  async archiveCourrier(id: string): Promise<void> {
    try {
      await apiClient.post<void>(`${endpoints.courrier.byId(id)}/archive`);
    } catch (error) {
      console.error(`Error archiving courrier ${id}:`, error);
      throw error;
    }
  }

  async reassignCourrier(id: string, newRecipient: string): Promise<OutgoingCourrier> {
    try {
      const response = await apiClient.post<OutgoingCourrier>(`${endpoints.courrier.byId(id)}/reassign`, {
        newRecipient
      });
      return response;
    } catch (error) {
      console.error(`Error reassigning courrier ${id}:`, error);
      throw error;
    }
  }

  async getTotalCount(filter?: CourrierFilter): Promise<number> {
    try {
      const params = {
        type: 'outgoing',
        ...filter
      };
      
      const response = await apiClient.get<{ count: number }>(endpoints.courrier.count, params);
      return response.count;
    } catch (error) {
      console.error('Error fetching courriers count:', error);
      throw error;
    }
  }
}
